package com.AV.AirVista.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.AV.AirVista.Dto.BookingDto;
import com.AV.AirVista.Dto.Request.PaymentRequestDto;
import com.AV.AirVista.Dto.Response.PaymentResponse;
import com.AV.AirVista.Model.AppUser;
import com.AV.AirVista.Model.Booking;
import com.AV.AirVista.Model.Flight;
import com.AV.AirVista.Model.Seat;
import com.AV.AirVista.Model.Enums.SeatStatus;
import com.AV.AirVista.Repository.BookingRepo;
import com.AV.AirVista.Repository.FlightRepo;
import com.AV.AirVista.Repository.SeatRepository;
import com.AV.AirVista.Repository.UserRepository;
import com.razorpay.RazorpayException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepo bookingRepo;
    private final FlightRepo flightRepo;
    private final UserRepository userRepo;
    private final EmailService emailService;
    private final PaymentService paymentService;
    private final SeatRepository seatRepo;

    @Transactional
    public PaymentResponse addBookingAndInitiatePayment(BookingDto req) throws RazorpayException {

        Flight flight = flightRepo.findById(req.getFlightId())
                .orElseThrow(() -> new RuntimeException("Flight not found"));
        AppUser user = userRepo.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Seat> selectedSeats = null;
        if (req.getSelectedSeatNumbers() != null && !req.getSelectedSeatNumbers().isEmpty()) {
            selectedSeats = req.getSelectedSeatNumbers().stream()
                    .map(seatNumber -> seatRepo.findByFlightAndSeatNumber(flight, seatNumber)
                            .orElseThrow(() -> new RuntimeException(
                                    "Seat " + seatNumber + " not found for flight " + flight.getFlightNumber())))
                    .collect(Collectors.toList());

            boolean allSeatsAvailable = selectedSeats.stream()
                    .allMatch(seat -> seat.getStatus() == SeatStatus.AVAILABLE);

            if (!allSeatsAvailable) {
                throw new RuntimeException("One or more selected seats are not available.");
            }

            selectedSeats.forEach(seat -> seat.setStatus(SeatStatus.BLOCKED));
            seatRepo.saveAll(selectedSeats);
        } else {
            if (flight.getAvailableSeats() < req.getNumberOfPassengers()) {
                throw new RuntimeException("Not enough general seats available for this flight.");
            }
        }

        if (selectedSeats != null && selectedSeats.size() != req.getNumberOfPassengers()) {
            throw new RuntimeException("Number of selected seats must match number of passengers.");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setFlight(flight);
        booking.setBookingDate(LocalDate.now());
        booking.setTotalPrice(flight.getPrice().multiply(new BigDecimal(req.getNumberOfPassengers())));
        booking.setStatus("PENDING");
        booking.setAssignedSeats(selectedSeats);

        booking = bookingRepo.save(booking);

        PaymentRequestDto paymentRequest = new PaymentRequestDto();
        paymentRequest.setAmount(booking.getTotalPrice());
        paymentRequest.setCurrency("INR");
        paymentRequest.setReceipt("BOOKING_" + booking.getId());
        paymentRequest.setUserName(user.getFname());
        paymentRequest.setUserEmail(user.getEmail());

        PaymentResponse razorpayOrderResponse = paymentService.createOrder(paymentRequest);

        booking.setRazorPaymentId(razorpayOrderResponse.getOrderId());
        bookingRepo.save(booking);

        return razorpayOrderResponse;
    }

    @Transactional
    @SuppressWarnings("UseSpecificCatch")
    public void confirmBooking(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        Booking booking = bookingRepo.findByRazorPayOrderId(razorpayOrderId)
                .orElseThrow(() -> new RuntimeException("Booking not found for Razorpay Order ID: " + razorpayOrderId));

        if ("CONFIRMED".equals(booking.getStatus()))
            return;

        try {
            boolean isValidSignature = paymentService.verifyPaymentSignature(razorpayOrderId, razorpayPaymentId,
                    razorpaySignature);

            if (isValidSignature) {
                booking.setStatus("CONFIRMED");
                booking.setRazorPaymentId(razorpayPaymentId);
                booking.setRazorPaymentId(razorpaySignature);
                bookingRepo.save(booking);

                // Send confirmation email
                String subject = "AirVista Booking Confirmation - Your Flight " + booking.getFlight().getFlightNumber()
                        + " is Confirmed!";
                String body = "Dear " + booking.getUser().getFname() + booking.getUser().getLname() + ",\n\n"
                        + "Your booking for flight " + booking.getFlight().getFlightNumber()
                        + " from " + booking.getFlight().getOrigin().getCity()
                        + " to " + booking.getFlight().getDestination().getCity()
                        + " on " + booking.getFlight().getDeptTime().toLocalDate()
                        + " at " + booking.getFlight().getDeptTime().toLocalTime()
                        + " is CONFIRMED.\n\n"
                        + "Booking ID: " + booking.getId() + "\n"
                        + "Total Price: " + booking.getTotalPrice() + " INR\n"
                        + "Razorpay Payment ID: " + razorpayPaymentId + "\n\n"
                        + "Thank you for booking with AirVista!";
                emailService.sendEmail(booking.getUser().getEmail(), subject, body);

            } else {
                booking.setStatus("FAILED");
                bookingRepo.save(booking);
                throw new RuntimeException("Payment verification failed (Invalid signature).");
            }
        } catch (Exception e) {
            booking.setStatus("FAILED");
            bookingRepo.save(booking);
            throw new RuntimeException("Error during payment verification: " + e.getMessage(), e);
        }
    }

    // Cancel a booking
    @Transactional
    public ResponseEntity<Booking> cancelBooking(Long id) {
        Optional<Booking> bookingOpt = bookingRepo.findById(id);
        if (bookingOpt.isEmpty())
            return ResponseEntity.notFound().build();

        Booking booking = bookingOpt.get();
        booking.setStatus("CANCELED");
        return ResponseEntity.ok(bookingRepo.save(booking));
    }

    // Delete a booking
    public ResponseEntity<String> deleteBooking(Long id) {
        Optional<Booking> bookingOpt = bookingRepo.findById(id);
        if (bookingOpt.isEmpty())
            return ResponseEntity.notFound().build();

        bookingRepo.deleteById(id);
        return ResponseEntity.ok("Booking deleted successfully with id: " + id);
    }

    // Get booking by ID
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepo.findById(id);
    }

    // List bookings by user
    public List<Booking> listBookingsByUser(Long userId) {
        return bookingRepo.findByUserId(userId);
    }

    // List bookings by flight
    public List<Booking> listBookingsByFlightId(Long flightId) {
        return bookingRepo.findByFlightId(flightId);
    }

    // Get all bookings
    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
    }

    // DTO conversion helper
    public BookingDto toDto(Booking booking) {
        return BookingDto.builder()
                .id(booking.getId())
                .flightId(booking.getFlight().getId())
                .passengerId(booking.getPassenger().getId())
                .userId(booking.getUser().getId())
                .bookingDate(booking.getBookingDate())
                .status(booking.getStatus())
                .build();
    }
}
