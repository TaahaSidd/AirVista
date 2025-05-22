package com.AV.AirVista.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.AV.AirVista.Dto.BookingDto;
import com.AV.AirVista.Model.AppUser;
import com.AV.AirVista.Model.Booking;
import com.AV.AirVista.Model.Flight;
import com.AV.AirVista.Model.Passenger;
import com.AV.AirVista.Repository.AppUserRepo;
import com.AV.AirVista.Repository.BookingRepo;
import com.AV.AirVista.Repository.FlightRepo;
import com.AV.AirVista.Repository.PassengerRepo;

import jakarta.transaction.Transactional;

@Service
public class BookingService {

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private FlightRepo flightRepo;

    @Autowired
    private PassengerRepo passengerRepo;

    @Autowired
    private AppUserRepo userRepo;

    @Transactional
    public ResponseEntity<Booking> addBooking(BookingDto req) {

        Flight flight = flightRepo.findById(req.getFlightId())
                .orElseThrow(() -> new RuntimeException("Flight not found with id" + req.getFlightId()));

        Passenger passenger = passengerRepo.findById(req.getPassengerId())
                .orElseThrow(() -> new RuntimeException("Passenger not Found with id" + req.getPassengerId()));

        AppUser user = userRepo.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id" + req.getUserId()));

        Booking booking = new Booking();
        booking.setFlight(flight);
        booking.setPassenger(passenger);
        booking.setUser(user);
        booking.setBookingDate(req.getBookingDate());
        booking.setStatus(req.getStatus());

        return ResponseEntity.ok(bookingRepo.save(booking));
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepo.findById(id);
    }

    @Transactional
    public ResponseEntity<Booking> cancelBooking(Long id) {
        Optional<Booking> bookingOpt = bookingRepo.findById(id);

        if (bookingOpt.isEmpty())
            return ResponseEntity.notFound().build();

        Booking booking = bookingOpt.get();
        booking.setStatus("CANCELED");
        return ResponseEntity.ok(bookingRepo.save(booking));
    }

    public List<Booking> listBookingsByUser(Long userid) {
        return bookingRepo.findByUserId(userid);
    }

    public List<Booking> listBookingsByflightId(Long flightId) {
        return bookingRepo.findByFlightId(flightId);
    }

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

    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
    }

    public ResponseEntity<String> deleteBooking(Long id) {
        Optional<Booking> bookingOpt = bookingRepo.findById(id);

        if (bookingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        bookingRepo.deleteById(id);
        return ResponseEntity.ok("Booking deleted sucessfully with id: " + id);
    }
}
