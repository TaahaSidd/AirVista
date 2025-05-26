package com.AV.AirVista.Controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.AV.AirVista.Dto.Request.PaymentRequestDto;
import com.AV.AirVista.Dto.Response.PaymentResponse;
import com.AV.AirVista.Service.BookingService;
import com.AV.AirVista.Service.PaymentService;
import com.razorpay.RazorpayException;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("AirVista/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final BookingService bookingService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createRazorpayOrder(@RequestBody PaymentRequestDto requestDto) {
        try {
            PaymentResponse response = paymentService.createOrder(requestDto);
            return ResponseEntity.ok(response);
        } catch (RazorpayException e) {
            System.err.println("Error creating Razorpay order: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create Razorpay order: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("An unexpected error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred during order creation.");
        }
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> payload) {
        String razorpayOrderId = payload.get("razorpay_order_id");
        String razorpayPaymentId = payload.get("razorpay_payment_id");
        String razorpaySignature = payload.get("razorpay_signature");

        if (razorpayOrderId == null || razorpayPaymentId == null || razorpaySignature == null) {
            return ResponseEntity.badRequest().body("Missing required payment verification parameters.");
        }

        try {
            // Call bookingService to confirm the booking, which internally verifies the
            // signature
            bookingService.confirmBooking(razorpayOrderId, razorpayPaymentId, razorpaySignature);
            return ResponseEntity.ok("Payment verified and booking confirmed successfully!");
        } catch (RuntimeException e) {
            // Catch exceptions thrown by bookingService.confirmBooking
            System.err.println("Payment verification/booking confirmation failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            System.err.println("An unexpected error occurred during payment verification: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred during payment verification.");
        }
    }
}
