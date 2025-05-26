package com.AV.AirVista.Dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.format.annotation.DateTimeFormat;

import com.AV.AirVista.Model.Enums.CabinClass;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FlightSearchCriteriaDto {

    private String originCity;
    private String destinationCity;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate deptDate;

    // For round trip search or range search
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate returnDate;

    private Integer minStops;
    private Integer maxStops;

    private String airline;

    private BigDecimal minPrice;
    private BigDecimal maxPrice;

    @DateTimeFormat(iso = DateTimeFormat.ISO.TIME)
    private LocalTime minDepTime;
    @DateTimeFormat(iso = DateTimeFormat.ISO.TIME)
    private LocalTime maxDepTime;

    private CabinClass cabinClass;

    private Integer passengers;
}
