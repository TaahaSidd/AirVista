package com.AV.AirVista.Dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FlightDto {

    @NotNull(message = "Id is required")
    private Long id;

    @NotNull(message = "Flight number is required")
    private String flightNumber;

    @NotBlank(message = "Origin is required")
    private String origin;

    @NotBlank(message = " Destination is required")
    private String destination;
    @NotNull(message = "Departure time is required")
    private LocalDateTime depTime;

    @NotNull(message = "Arrival time is required")
    private LocalDateTime arrTime;

    @Min(value = 1, message = "Seats must be at least 1")
    private Integer seats;

    @DecimalMin(value = "0.0", inclusive = true, message = "Price must be zero or positive")
    private double price;
}