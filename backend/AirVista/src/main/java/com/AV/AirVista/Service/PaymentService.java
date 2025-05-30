package com.AV.AirVista.Service;

import java.math.BigDecimal;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.AV.AirVista.Dto.Request.PaymentRequestDto;
import com.AV.AirVista.Dto.Response.PaymentResponse;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

@Service
public class PaymentService {
    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public PaymentResponse createOrder(PaymentRequestDto req) throws RazorpayException {
        RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        long amountInSmallestUnit = req.getAmount().multiply(new BigDecimal(100)).longValue();

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInSmallestUnit);
        orderRequest.put("currency", req.getCurrency());
        orderRequest.put("receipt", req.getReceipt());

        orderRequest.put("payment_capture", 1);

        Order order = razorpayClient.orders.create(orderRequest);

        return PaymentResponse.builder()
                .orderId(order.get("id"))
                .currency(order.get("currency"))
                .amount(new BigDecimal(order.get("amount").toString()).divide(new BigDecimal(100)))
                .keyId(razorpayKeyId)
                .userName(req.getUserName())
                .userEmail(req.getUserEmail())
                .description("AirVista Flight Booking - Receipt: " + req.getReceipt())
                .build();
    }

    public boolean verifyPaymentSignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature)
            throws RazorpayException {
        return com.razorpay.Utils.verifySignature(razorpayOrderId + "|" + razorpayPaymentId, razorpaySignature,
                razorpayKeySecret);
    }

}
