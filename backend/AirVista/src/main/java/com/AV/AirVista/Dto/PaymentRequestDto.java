package com.AV.AirVista.Dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequestDto {

    private BigDecimal amount;
    private String currency;
    private String receipt;
    private String userName;
    private String userEmail;
}
