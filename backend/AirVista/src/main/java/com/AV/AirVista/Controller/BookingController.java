package com.AV.AirVista.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.AV.AirVista.Dto.BookingDto;
import com.AV.AirVista.Model.Booking;
import com.AV.AirVista.Service.BookingService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/Booking")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/add")
    public ResponseEntity<Booking> addBooking(@Valid @RequestBody BookingDto req) {
        return bookingService.addBooking(req);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@RequestParam Long id) {
        Booking booking = bookingService.getBookingById(id);

        if (booking == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(booking);
    }

    @PutMapping("cancel/{id}")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long id) {
        return bookingService.cancelBooking(id);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Booking>> getBookingByUser(@RequestParam Long id) {
        return bookingService.listBookingByUser(id);
    }

    @GetMapping("/{flightId}")
    public ResponseEntity<List<Booking>> getFlightById(@RequestParam Long id) {
        return bookingService.listFlightById(id);
    }

}
