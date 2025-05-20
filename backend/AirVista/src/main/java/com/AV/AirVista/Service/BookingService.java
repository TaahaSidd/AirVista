package com.AV.AirVista.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.AV.AirVista.Dto.BookingDto;
import com.AV.AirVista.Model.Booking;
import com.AV.AirVista.Model.Flight;
import com.AV.AirVista.Model.Passenger;
import com.AV.AirVista.Repository.BookingRepo;
import com.AV.AirVista.Repository.FlightRepo;
import com.AV.AirVista.Repository.PassengerRepo;

@Service
public class BookingService {

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private FlightRepo flightRepo;

    @Autowired
    private PassengerRepo passengerRepo;

    public ResponseEntity<Booking> addBooking(BookingDto req) {

        Flight flight = flightRepo.findById(req.getId())
                .orElseThrow(() -> new RuntimeException("Flight not found with id" + req.getId()));

        Passenger passenger = passengerRepo.findById(req.getId())
                .orElseThrow(() -> new RuntimeException("Passenger not Found with id" + req.getId()));

        Booking booking = new Booking();
        booking.setFlight(flight);
        booking.setPassenger(passenger);
        booking.setBookingDate(req.getBookingDate());
        booking.setStatus(req.getStatus());

        return ResponseEntity.ok(bookingRepo.save(booking));
    }

    public Booking getBookingById(Long id) {
        return bookingRepo.findById(id).orElse(null);
    }

    public ResponseEntity<Booking> cancelBooking(Long id) {
        Optional<Booking> bookingOpt = bookingRepo.findById(id);

        if (bookingOpt.isEmpty())
            return ResponseEntity.notFound().build();

        Booking booking = bookingOpt.get();
        booking.setStatus("CANCELED");
        return ResponseEntity.ok(bookingRepo.save(booking));
    }

    public ResponseEntity<List<Booking>> listBookingByUser(Long id) {
        return ResponseEntity.ok(bookingRepo.findByUserId(id));
    }

    public ResponseEntity<List<Booking>> listFlightById(Long id) {
        return ResponseEntity.ok(bookingRepo.findByFlightId(id));
    }
}
