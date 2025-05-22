package com.AV.AirVista.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.AV.AirVista.Dto.BookingDto;
import com.AV.AirVista.Model.Booking;
import com.AV.AirVista.Service.BookingService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("AirVista/Booking")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/add")
    public ResponseEntity<Booking> addBooking(@Valid @RequestBody BookingDto req) {
        return bookingService.addBooking(req);
    }

    @GetMapping("/bookingId/{id}")
    public ResponseEntity<BookingDto> getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id)
                .map(bookingService::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long id) {
        return bookingService.cancelBooking(id);
    }

    @GetMapping("/user/{userId}/bookings")
    public ResponseEntity<List<BookingDto>> getBookingByUser(@PathVariable Long userid) {
        List<Booking> bookings = bookingService.listBookingsByUser(userid);
        List<BookingDto> dtos = bookings.stream()
                .map(bookingService::toDto)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/flight/{flightId}/bookings")
    public ResponseEntity<List<BookingDto>> getFlightById(@PathVariable Long flightId) {

        List<Booking> bookings = bookingService.listBookingsByflightId(flightId);
        List<BookingDto> dtos = bookings.stream()
                .map(bookingService::toDto)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping
    public ResponseEntity<List<BookingDto>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        List<BookingDto> dtos = bookings.stream()
                .map(bookingService::toDto)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteBooking(@PathVariable Long id) {
        return bookingService.deleteBooking(id);
    }

}
