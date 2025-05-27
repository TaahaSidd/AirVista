package com.AV.AirVista.Controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.AV.AirVista.Dto.Request.BookingRequestDto;
import com.AV.AirVista.Dto.Response.BookingResponseDto;
import com.AV.AirVista.Dto.Response.PaymentResponse;
import com.AV.AirVista.Exception.ResourceNotFoundException;
import com.AV.AirVista.Model.AppUser;
import com.AV.AirVista.Service.AppUserService;
import com.AV.AirVista.Service.BookingService;
import com.razorpay.RazorpayException;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("AirVista/Booking")
@RequiredArgsConstructor
public class BookingController {

    private static final Logger log = LoggerFactory.getLogger(BookingController.class);

    private final BookingService bookingService;
    private final AppUserService userService;

    @PostMapping("/initiate")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<?> initiateBookingAndPayment(
            @Valid @RequestBody BookingRequestDto requestDto,
            Authentication authentication) {
        log.info("Initiating booking and payment for user: {}", authentication.getName());
        try {
            PaymentResponse response = bookingService.addBookingAndInitiatePayment(requestDto);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            log.warn("Booking initiation failed: Resource not found. {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("Booking initiation failed: Invalid argument. {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (RazorpayException e) {
            log.error("Error during Razorpay order creation for user {}: {}", authentication.getName(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to initiate payment: " + e.getMessage());
        } catch (Exception e) {
            log.error("An unexpected error occurred during booking initiation for user {}: {}",
                    authentication.getName(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred during booking initiation.");
        }
    }

    // GET booking by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<BookingResponseDto> getBookingById(@PathVariable Long id, Authentication authentication) {
        log.info("Attempting to fetch booking with ID: {} for user: {}", id, authentication.getName());
        try {
            BookingResponseDto booking = bookingService.getBookingById(id);

            // Optional: Add a security check to ensure user can only view their own booking
            // (if not ADMIN)
            AppUser currentUser = userService.getUserByEmail(authentication.getName());
            if (!currentUser.getRole().contains("ROLE_ADMIN") && !booking.getUserId().equals(currentUser.getId())) {
                log.warn("User {} attempted to access booking {} which does not belong to them.",
                        currentUser.getEmail(), id);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            return ResponseEntity.ok(booking);
        } catch (ResourceNotFoundException e) {
            log.warn("Booking with ID {} not found: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Error fetching booking with ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // PUT method to cancel a booking
    @PutMapping("/cancel/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id, Authentication authentication) {
        log.info("Attempting to cancel booking with ID: {} by user: {}", id, authentication.getName());
        try {
            AppUser currentUser = userService.getUserByEmail(authentication.getName());
            BookingResponseDto existingBooking = bookingService.getBookingById(id);
            if (!currentUser.getRole().contains("ROLE_ADMIN")
                    && !existingBooking.getUserId().equals(currentUser.getId())) {
                log.warn("User {} attempted to cancel booking {} which does not belong to them.",
                        currentUser.getEmail(), id);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access Denied: You can only cancel your own bookings.");
            }

            BookingResponseDto cancelledBooking = bookingService.cancelBooking(id);
            return ResponseEntity.ok(cancelledBooking);
        } catch (ResourceNotFoundException e) {
            log.warn("Cancellation failed: Booking with ID {} not found. {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("Cancellation failed for booking {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("Error cancelling booking with ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An internal server error occurred during cancellation.");
        }
    }

    // GET all bookings for a specific user.
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or @userService.getUserIdByEmail(authentication.getName()) == #userId")
    public ResponseEntity<List<BookingResponseDto>> getBookingsByUser(@PathVariable Long userId,
            Authentication authentication) {
        log.info("Fetching bookings for user ID: {} by user: {}", userId, authentication.getName());
        try {
            List<BookingResponseDto> bookings = bookingService.listBookingsByUser(userId);
            if (bookings.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(bookings);
        } catch (ResourceNotFoundException e) {
            log.warn("User with ID {} not found while fetching bookings: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Error fetching bookings for user ID {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET all bookings for a specific flight
    @GetMapping("/flight/{flightId}")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<List<BookingResponseDto>> getBookingsByFlightId(@PathVariable Long flightId) {
        log.info("Fetching bookings for flight ID: {}", flightId);
        try {
            List<BookingResponseDto> bookings = bookingService.listBookingsByFlightId(flightId);
            if (bookings.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(bookings);
        } catch (ResourceNotFoundException e) {
            log.warn("Flight with ID {} not found while fetching bookings: {}", flightId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Error fetching bookings for flight ID {}: {}", flightId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET all bookings (Admin only)
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<BookingResponseDto>> getAllBookings() {
        log.info("Fetching all bookings (Admin request)");
        List<BookingResponseDto> bookings = bookingService.getAllBookings();
        if (bookings.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(bookings);
    }

    // DELETE a booking
    // booking)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        log.warn("Attempting to delete booking with ID: {} (Admin action).", id);
        try {
            bookingService.deleteBooking(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            log.warn("Deletion failed: Booking with ID {} not found. {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Error deleting booking with ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Endpoint for Razorpay webhook callback (no @PreAuthorize needed, Razorpay
    // calls this)
    @PostMapping("/payment-callback")
    public ResponseEntity<String> handleRazorpayCallback(@RequestBody String payload) {
        log.info("Received Razorpay payment callback.");
        try {
            // Let's assume a dummy extraction for now, you'd need a real one.
            String razorpayOrderId = "order_xyz";
            String razorpayPaymentId = "pay_abc";
            String razorpaySignature = "sig_123";
            bookingService.confirmBooking(razorpayOrderId, razorpayPaymentId, razorpaySignature);
            log.info("Razorpay callback processed successfully for order ID: {}", razorpayOrderId);
            return ResponseEntity.ok("Payment confirmed successfully");
        } catch (ResourceNotFoundException e) {
            log.warn("Payment callback failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Booking not found for payment: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("Payment callback verification failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment verification failed: " + e.getMessage());
        } catch (Exception e) {
            log.error("Error processing Razorpay payment callback: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing payment callback");
        }
    }

}
