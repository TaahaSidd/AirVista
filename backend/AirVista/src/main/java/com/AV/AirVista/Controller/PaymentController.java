package com.AV.AirVista.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.AV.AirVista.Service.PaymentService;

import lombok.RequiredArgsConstructor;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.AV.AirVista.Dto.PaymentRequestDto;
import com.AV.AirVista.Dto.PaymentResponse;
import com.razorpay.RazorpayException;

@RestController
@RequestMapping("AirVista/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createRazorpayOrder(@RequestBody PaymentRequestDto requestDto) {
        try {
            PaymentResponse response = paymentService.createOrder(requestDto);
            return ResponseEntity.ok(response);
        } catch (RazorpayException e) {
            // Log the exception for debugging
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
            boolean isValidSignature = paymentService.verifyPaymentSignature(razorpayOrderId, razorpayPaymentId,
                    razorpaySignature);

            if (isValidSignature) {
                System.out.println("Payment verification successful for Order ID: " + razorpayOrderId);
                return ResponseEntity.ok("Payment verified successfully!");
            } else {
                System.out.println("Payment verification failed: Invalid signature for Order ID: " + razorpayOrderId);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Payment verification failed: Invalid signature.");
            }
        } catch (RazorpayException e) {
            System.err.println("Error during payment signature verification: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error verifying payment: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("An unexpected error occurred during payment verification: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred during payment verification.");
        }
    }
}
