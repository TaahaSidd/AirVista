package com.AV.AirVista.Controller;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.AV.AirVista.Dto.AviationStack.FlightData;
import com.AV.AirVista.Model.Flight;
import com.AV.AirVista.Service.AviationStackService;
import com.AV.AirVista.Service.FlightService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/flight-status")
@RequiredArgsConstructor
public class AviationStackController {
    private final AviationStackService aviationStackService;
    private final FlightService flightService;

    @GetMapping("/{flightId}")
    public ResponseEntity<?> getAndUpdateFlightStatus(@PathVariable Long flightId) {
        // First, check if the internal flight exists
        Optional<Flight> internalFlightOptional = flightService.getFlightById(flightId);
        if (internalFlightOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Flight> updatedFlightOptional = aviationStackService.updateFlightStatus(flightId);

        if (updatedFlightOptional.isPresent()) {
            return ResponseEntity.ok(updatedFlightOptional.get());
        } else {
            return ResponseEntity.status(503)
                    .body("Could not fetch real-time status for flight " + flightId + ". Please try again later.");
        }
    }

    @GetMapping("/external/{flightNumber}/{flightDate}")
    public ResponseEntity<?> getExternalFlightStatus(
            @PathVariable String flightNumber,
            @PathVariable String flightDate) {
        Optional<FlightData> flightDataOptional = aviationStackService.getFlightStatus(flightNumber, flightDate);

        if (flightDataOptional.isPresent()) {
            return ResponseEntity.ok(flightDataOptional.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No external flight status found for flight number: " + flightNumber + " on " + flightDate);
        }
    }
}
