package com.AV.AirVista.Dto.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.AV.AirVista.Model.Enums.BookingStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseDto {

    private Long id;
    private Long userId;
    private Long flightId;

    private LocalDate bookingDate;

    private BookingStatus status;

    private BigDecimal totalPrice;

    private String razorPayOrderId;
    private String razorPaymentId;
    private String razorPaymentSignature;

    private List<PassengerResponseDto> passengers;

    private List<String> assignedSeatNumbers;
}