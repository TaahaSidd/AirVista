package com.AV.AirVista.Dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
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
public class FlightDto {

    // @NotNull(message = "Id is required")
    private Long id;

    // private Long originId;
    // private Long destinationId;

    @NotNull(message = "Flight number is required")
    private String flightNumber;

    @NotBlank(message = "Origin Code is required")
    private String originCode;

    @NotBlank(message = " Destination Code is required")
    private String destinationCode;
    @NotNull(message = "Departure time is required")
    private LocalDateTime deptTime;

    @NotNull(message = "Arrival time is required")
    private LocalDateTime arrTime;

    @Min(value = 1, message = "Seats must be at least 1")
    private Integer seats;

    @DecimalMin(value = "0.0", inclusive = true, message = "Price must be zero or positive")
    private double price;
}