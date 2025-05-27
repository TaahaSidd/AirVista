package com.AV.AirVista.Dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.AV.AirVista.Model.Enums.CabinClass;

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

    private Long id;

    @NotBlank(message = "Flight number is required")
    private String flightNumber;

    @NotBlank(message = "Airline name is required")
    private String airline;

    @NotBlank(message = "Origin Code is required")
    private String originCode;

    @NotBlank(message = "Destination Code is required")
    private String destinationCode;

    @NotNull(message = "Departure time is required")
    private LocalDateTime deptTime;

    @NotNull(message = "Arrival time is required")
    private LocalDateTime arrTime;

    @NotNull(message = "Total seats must be specified")
    @Min(value = 1, message = "Total seats must be at least 1")
    private Integer seats;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price must be zero or positive")
    private BigDecimal price;

    @NotNull(message = "Number of stops is required")
    @Min(value = 0, message = "Stops cannot be negative")
    private Integer stops;

    @NotNull(message = "Cabin class is required")
    private CabinClass cabinClass;

    // --- Live Tracking Details
    // ---
    private String flightStatus;
    private String statusMessage;

    private LocalDateTime actualDeptTime;
    private String depTerminal;
    private String depGate;
    private Integer depDelay;

    private LocalDateTime actualArrTime;
    private String arrTerminal;
    private String arrGate;
    private Integer arrDelay;
}