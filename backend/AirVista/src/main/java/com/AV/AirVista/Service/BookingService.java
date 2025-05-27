package com.AV.AirVista.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.AV.AirVista.Dto.Request.BookingRequestDto;
import com.AV.AirVista.Dto.Request.PaymentRequestDto;
import com.AV.AirVista.Dto.Response.BookingResponseDto;
import com.AV.AirVista.Dto.Response.PassengerResponseDto;
import com.AV.AirVista.Dto.Response.PaymentResponse;
import com.AV.AirVista.Exception.ResourceNotFoundException;
import com.AV.AirVista.Model.AppUser;
import com.AV.AirVista.Model.Booking;
import com.AV.AirVista.Model.Flight;
import com.AV.AirVista.Model.Passenger;
import com.AV.AirVista.Model.Seat;
import com.AV.AirVista.Model.Enums.BookingStatus;
import com.AV.AirVista.Model.Enums.SeatStatus;
import com.AV.AirVista.Repository.BookingRepo;
import com.AV.AirVista.Repository.FlightRepo;
import com.AV.AirVista.Repository.PassengerRepo;
import com.AV.AirVista.Repository.SeatRepository;
import com.AV.AirVista.Repository.UserRepository;
import com.razorpay.RazorpayException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingService {

    private static final Logger log = LoggerFactory.getLogger(BookingService.class);

    private final BookingRepo bookingRepo;
    private final FlightRepo flightRepo;
    private final UserRepository userRepo;
    private final EmailService emailService;
    private final PaymentService paymentService;
    private final SeatRepository seatRepo;

    @Transactional
    public PaymentResponse addBookingAndInitiatePayment(BookingRequestDto req) throws RazorpayException {
        log.info("Initiating booking for user ID: {} on flight ID: {}", req.getUserId(), req.getFlightId());

        // 1. Fetch Flight and User
        Flight flight = flightRepo.findById(req.getFlightId())
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with ID: " + req.getFlightId()));
        AppUser user = userRepo.findById(req.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + req.getUserId()));

        // 2. Validate and Process Seats
        List<Seat> selectedSeats = null;
        BigDecimal totalFare = BigDecimal.ZERO;
        int numberOfPassengers = req.getPassengers().size();

        if (req.getSelectedSeatNumbers() != null && !req.getSelectedSeatNumbers().isEmpty()) {
            if (req.getSelectedSeatNumbers().size() != numberOfPassengers) {
                throw new IllegalArgumentException("Number of selected seats (" + req.getSelectedSeatNumbers().size() +
                        ") must match the number of passengers (" + numberOfPassengers + ").");
            }

            selectedSeats = req.getSelectedSeatNumbers().stream()
                    .map(seatNumber -> seatRepo.findByFlightAndSeatNumber(flight, seatNumber)
                            .orElseThrow(() -> new ResourceNotFoundException(
                                    "Seat " + seatNumber + " not found for flight " + flight.getFlightNumber())))
                    .collect(Collectors.toList());

            boolean allSeatsAvailable = selectedSeats.stream()
                    .allMatch(seat -> seat.getStatus() == SeatStatus.AVAILABLE);

            if (!allSeatsAvailable) {
                throw new IllegalArgumentException("One or more selected seats are not available or already blocked.");
            }

            selectedSeats.forEach(seat -> {
                seat.setStatus(SeatStatus.BLOCKED);
                log.debug("Blocking seat: {}", seat.getSeatNumber());
            });
            seatRepo.saveAll(selectedSeats);

            totalFare = flight.getPrice().multiply(new BigDecimal(numberOfPassengers));
        } else {

            if (flight.getAvailableSeats() < numberOfPassengers) {
                throw new IllegalArgumentException("Not enough general seats available for this flight for "
                        + numberOfPassengers + " passengers.");
            }
            // If no seats are selected, just use flight price per person.
            totalFare = flight.getPrice().multiply(new BigDecimal(numberOfPassengers));
        }

        // 4. Create Booking Entity (transient state)
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setFlight(flight);
        booking.setBookingDate(LocalDate.now());
        booking.setTotalPrice(totalFare);
        booking.setStatus(BookingStatus.PENDING);
        booking.setAssignedSeats(selectedSeats); // Can be null if no specific seats selected

        Booking savedBooking = bookingRepo.save(booking);
        log.info("Booking with ID: {} created with PENDING status (initial save).", savedBooking.getId());

        // 3. Create Passenger Entities and Link to the saved Booking
        List<Passenger> passengers = req.getPassengers().stream()
                .map(passengerDto -> {
                    Passenger passenger = new Passenger();
                    passenger.setName(passengerDto.getName());
                    passenger.setEmail(passengerDto.getEmail());
                    passenger.setPhone(passengerDto.getPhone());
                    passenger.setBooking(savedBooking);
                    return passenger;
                })
                .collect(Collectors.toList());

        savedBooking.setPassengers(passengers);

        // 5. Initiate Payment
        PaymentRequestDto paymentRequest = new PaymentRequestDto();
        paymentRequest.setAmount(totalFare.multiply(new BigDecimal("100")));
        paymentRequest.setCurrency("INR");
        paymentRequest.setReceipt("BOOKING_" + savedBooking.getId());
        paymentRequest.setUserName(user.getFname() + " " + user.getLname());
        paymentRequest.setUserEmail(user.getEmail());

        PaymentResponse razorpayOrderResponse = paymentService.createOrder(paymentRequest);
        log.info("Razorpay order created for booking ID: {}, Order ID: {}", savedBooking.getId(),
                razorpayOrderResponse.getOrderId());

        // 6. Update Booking with Razorpay Order ID and Save
        savedBooking.setRazorPayOrderId(razorpayOrderResponse.getOrderId());
        bookingRepo.save(savedBooking);

        return razorpayOrderResponse;
    }

    @Transactional
    @SuppressWarnings("UseSpecificCatch")
    public void confirmBooking(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        log.info("Attempting to confirm booking for Razorpay Order ID: {}", razorpayOrderId);

        Booking booking = bookingRepo.findByRazorPayOrderId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found for Razorpay Order ID: " + razorpayOrderId));

        // Prevent double confirmation
        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            log.warn("Booking for Order ID {} is already confirmed. Skipping re-confirmation.", razorpayOrderId);
            return;
        }

        try {
            boolean isValidSignature = paymentService.verifyPaymentSignature(razorpayOrderId, razorpayPaymentId,
                    razorpaySignature);

            if (isValidSignature) {
                booking.setStatus(BookingStatus.CONFIRMED);
                booking.setRazorPaymentId(razorpayPaymentId);
                booking.setRazorPaymentSignature(razorpaySignature);
                bookingRepo.save(booking);
                log.info("Booking ID {} confirmed successfully. Payment ID: {}", booking.getId(), razorpayPaymentId);

                if (booking.getAssignedSeats() != null) {
                    booking.getAssignedSeats().forEach(seat -> {
                        seat.setStatus(SeatStatus.BOOKED);
                        log.debug("Setting seat {} status to BOOKED for booking ID {}", seat.getSeatNumber(),
                                booking.getId());
                    });
                    seatRepo.saveAll(booking.getAssignedSeats());
                }

                // Send confirmation email
                String subject = "AirVista Booking Confirmation - Your Flight " + booking.getFlight().getFlightNumber()
                        + " is Confirmed!";
                String body = "Dear " + booking.getUser().getFname() + " " + booking.getUser().getLname() + ",\n\n" // space
                        + "Your booking for flight " + booking.getFlight().getFlightNumber()
                        + " from " + booking.getFlight().getOrigin().getCity()
                        + " to " + booking.getFlight().getDestination().getCity()
                        + " on " + booking.getFlight().getDeptTime().toLocalDate()
                        + " at " + booking.getFlight().getDeptTime().toLocalTime()
                        + " is CONFIRMED.\n\n"
                        + "Booking ID: " + booking.getId() + "\n"
                        + "Total Price: " + booking.getTotalPrice() + " INR\n"
                        + "Razorpay Payment ID: " + razorpayPaymentId + "\n\n"
                        + "Thank you for booking with AirVista! Your passengers:\n";

                if (booking.getPassengers() != null) {
                    for (Passenger p : booking.getPassengers()) {
                        body += "- " + p.getName() + " (" + p.getEmail() + ")\n";
                    }
                }
                body += "\nAssigned Seats: " + (booking.getAssignedSeats() != null
                        ? booking.getAssignedSeats().stream().map(Seat::getSeatNumber).collect(Collectors.joining(", "))
                        : "None selected") + "\n";

                emailService.sendEmail(booking.getUser().getEmail(), subject, body);
                log.info("Confirmation email sent to user: {}", booking.getUser().getEmail());

            } else {
                booking.setStatus(BookingStatus.FAILED_PAYMENT);
                bookingRepo.save(booking);
                log.warn("Payment verification failed for Order ID {}. Invalid signature.", razorpayOrderId);
                throw new IllegalArgumentException("Payment verification failed (Invalid signature).");
            }
        } catch (RazorpayException e) {
            booking.setStatus(BookingStatus.FAILED_PAYMENT);
            bookingRepo.save(booking);
            log.error("Razorpay error during payment verification for Order ID {}: {}", razorpayOrderId,
                    e.getMessage());
            throw new RuntimeException("Razorpay error during payment verification: " + e.getMessage(), e);
        } catch (Exception e) {
            booking.setStatus(BookingStatus.FAILED_PAYMENT);
            bookingRepo.save(booking);
            log.error("Unexpected error during payment verification for Order ID {}: {}", razorpayOrderId,
                    e.getMessage());
            throw new RuntimeException("Error during payment verification: " + e.getMessage(), e);
        }
    }

    // Cancel a booking
    @Transactional
    public BookingResponseDto cancelBooking(Long id) {
        log.info("Attempting to cancel booking with ID: {}", id);
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        if (booking.getStatus() == BookingStatus.CANCELLED || booking.getStatus() == BookingStatus.COMPLETED) {
            log.warn("Booking ID {} is already in status {}. Cannot cancel.", id, booking.getStatus());
            throw new IllegalArgumentException("Booking cannot be cancelled as it is already " + booking.getStatus());
        }

        if (booking.getAssignedSeats() != null && !booking.getAssignedSeats().isEmpty()) {
            booking.getAssignedSeats().forEach(seat -> {
                seat.setStatus(SeatStatus.AVAILABLE);
                log.debug("Releasing seat: {}", seat.getSeatNumber());
            });
            seatRepo.saveAll(booking.getAssignedSeats());
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking cancelledBooking = bookingRepo.save(booking);
        log.info("Booking ID {} cancelled successfully.", id);

        String subject = "AirVista Booking Cancellation - Flight " + booking.getFlight().getFlightNumber() + " (ID: "
                + booking.getId() + ")";
        String body = "Dear " + booking.getUser().getFname() + " " + booking.getUser().getLname() + ",\n\n"
                + "Your booking for flight " + booking.getFlight().getFlightNumber()
                + " from " + booking.getFlight().getOrigin().getCity()
                + " to " + booking.getFlight().getDestination().getCity()
                + " on " + booking.getFlight().getDeptTime().toLocalDate()
                + " has been CANCELLED.\n\n"
                + "Booking ID: " + booking.getId() + "\n"
                + "If you have any questions, please contact support.\n\n"
                + "Thank you for choosing AirVista.";
        emailService.sendEmail(booking.getUser().getEmail(), subject, body);

        return toBookingResponseDto(cancelledBooking);
    }

    // Delete a booking
    @Transactional
    public void deleteBooking(Long id) {
        log.warn("Attempting to permanently delete booking with ID: {}. This action is irreversible.", id);

        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        if (booking.getAssignedSeats() != null && !booking.getAssignedSeats().isEmpty()) {
            booking.getAssignedSeats().forEach(seat -> {
                seat.setStatus(SeatStatus.AVAILABLE);
                log.debug("Releasing seat: {} before deleting booking.", seat.getSeatNumber());
            });
            seatRepo.saveAll(booking.getAssignedSeats());
        }

        bookingRepo.delete(booking);
        log.info("Booking with ID: {} permanently deleted.", id);
    }

    // Get booking by id.
    public BookingResponseDto getBookingById(Long id) {
        log.info("Fetching booking by ID: {}", id);
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));
        return toBookingResponseDto(booking);
    }

    // List Booking by users.
    public List<BookingResponseDto> listBookingsByUser(Long userId) {
        log.info("Fetching bookings for user ID: {}", userId);
        AppUser user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        return bookingRepo.findByUser(user).stream()
                .map(this::toBookingResponseDto)
                .collect(Collectors.toList());
    }

    // List Bookings by flight Id.
    public List<BookingResponseDto> listBookingsByFlightId(Long flightId) {
        log.info("Fetching bookings for flight ID: {}", flightId);
        Flight flight = flightRepo.findById(flightId)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with ID: " + flightId));
        return bookingRepo.findByFlightId(flightId).stream()
                .map(this::toBookingResponseDto)
                .collect(Collectors.toList());
    }

    // Get All booking.
    public List<BookingResponseDto> getAllBookings() {
        log.info("Fetching all bookings.");
        return bookingRepo.findAll().stream()
                .map(this::toBookingResponseDto)
                .collect(Collectors.toList());
    }

    // DTO conversion helper
    public BookingResponseDto toBookingResponseDto(Booking booking) {
        List<String> assignedSeatNumbers = null;
        if (booking.getAssignedSeats() != null) {
            assignedSeatNumbers = booking.getAssignedSeats().stream()
                    .map(Seat::getSeatNumber)
                    .collect(Collectors.toList());
        }

        List<PassengerResponseDto> passengerResponseDtos = null;
        if (booking.getPassengers() != null) {
            passengerResponseDtos = booking.getPassengers().stream()
                    .map(this::toPassengerResponseDto)
                    .collect(Collectors.toList());
        }

        return BookingResponseDto.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .flightId(booking.getFlight().getId())
                .bookingDate(booking.getBookingDate())
                .status(booking.getStatus())
                .totalPrice(booking.getTotalPrice())
                .razorPayOrderId(booking.getRazorPayOrderId())
                .razorPaymentId(booking.getRazorPaymentId())
                .razorPaymentSignature(booking.getRazorPaymentSignature())
                .passengers(passengerResponseDtos)
                .assignedSeatNumbers(assignedSeatNumbers)
                .build();
    }

    private PassengerResponseDto toPassengerResponseDto(Passenger passenger) {
        return PassengerResponseDto.builder()
                .id(passenger.getId())
                .name(passenger.getName())
                .email(passenger.getEmail())
                .phone(passenger.getPhone())
                .build();
    }
}
