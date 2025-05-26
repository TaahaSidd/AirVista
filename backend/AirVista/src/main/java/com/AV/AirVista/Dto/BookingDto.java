package com.AV.AirVista.Dto;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingDto {
    private Long id;

    @NotNull(message = "User id is required")
    private Long userId;

    @NotNull(message = "Flight id is required")
    private Long flightId;

    @NotNull(message = "Passenger id is required")
    private Long passengerId;

    @NotNull(message = "Booking date is required")
    private LocalDate bookingDate;

    @NotBlank(message = "Booking status is required")
    private String status;

    private List<String> selectedSeatNumbers;
    private int numberOfPassengers;
}
