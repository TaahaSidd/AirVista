package com.AV.AirVista.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.AV.AirVista.Dto.BookingDto;
import com.AV.AirVista.Model.Booking;
import com.AV.AirVista.Repository.BookingRepo;

@Service
public class BookingService {

    @Autowired
    private BookingRepo bookingRepo;

    public ResponseEntity<Booking> addBooking(BookingDto req) {
        Booking booking = new Booking();

        booking.setFlight(req.getFlight());
        booking.setPassenger(req.getPassenger());
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
