package com.AV.AirVista.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.AV.AirVista.Dto.BookingDto;
import com.AV.AirVista.Model.Booking;
import com.AV.AirVista.Service.BookingService;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.AV.AirVista.Model.AppUser;
import com.AV.AirVista.Repository.BookingRepo;
import com.AV.AirVista.Repository.UserRepository;

@RestController
@RequestMapping("AirVista/Booking")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private UserRepository userRepo;

    // POST method for autnenticaed users.
    @PostMapping("/create")
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking, Authentication authentication) {
        String email = authentication.getName();

        Optional<AppUser> userOpt = userRepo.findByEmail(email);
        if (userOpt.isEmpty())
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        AppUser currentUser = userOpt.get();
        // Link the booking to current authenticated user.
        booking.setUser(currentUser);

        Booking savedBooking = bookingRepo.save(booking);
        return new ResponseEntity<>(savedBooking, HttpStatus.CREATED);
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

    // Get all bookings for authenticated user.
    @GetMapping("/my-bookings")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<List<Booking>> getMyBookings(Authentication authentication) {
        // Get email of current logged user.
        String email = authentication.getName();

        // Find user From db using email.
        Optional<AppUser> userOpt = userRepo.findByEmail(email);

        if (userOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        AppUser currentUser = userOpt.get();

        // Retrive Bookings for current User.
        List<Booking> userBookings = bookingRepo.findByUser(currentUser);

        if (userBookings.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);

        return new ResponseEntity<>(userBookings, HttpStatus.OK);
    }

    @GetMapping("/{id}/my-booking")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<Booking> getMyBookingById(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        Optional<AppUser> userOpt = userRepo.findByEmail(email);

        if (userOpt.isEmpty())
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        AppUser currentUser = userOpt.get();

        Optional<Booking> optBooking = bookingRepo.findByIdAndUser(id, currentUser);

        if (optBooking.isEmpty())
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        return new ResponseEntity<>(optBooking.get(), HttpStatus.OK);
    }

}
