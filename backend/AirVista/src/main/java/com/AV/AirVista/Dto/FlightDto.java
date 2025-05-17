package com.AV.AirVista.Dto;

import java.time.LocalTime;

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

    private String origin;
    private String destination;
    private LocalTime depTime;
    private LocalTime arrTime;
    private int seats;
    private double price;
}
// validation is left.