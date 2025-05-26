package com.AV.AirVista.Dto.Response;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponse {
    private String orderId;
    private String currency;
    private BigDecimal amount;
    private String keyId;
    private String userName;
    private String userEmail;
    private String description;
}
