package com.AV.AirVista.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.AV.AirVista.Dto.FlightDto;
import com.AV.AirVista.Dto.FlightSearchCriteriaDto;
import com.AV.AirVista.Exception.ResourceNotFoundException;
import com.AV.AirVista.Model.Flight;
import com.AV.AirVista.Service.FlightService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("AirVista/Flight")
@RequiredArgsConstructor
public class FlightController {

    private final FlightService flightService;

    @PostMapping("/add")
    public ResponseEntity<FlightDto> addFlight(@Valid @RequestBody FlightDto req) {
        Flight addedFlight = flightService.addFlight(req);
        return ResponseEntity.ok(flightService.toDto(addedFlight));
    }

    @GetMapping("/byId/{id}")
    public ResponseEntity<FlightDto> getFlightById(@PathVariable Long id) {
        Flight flight = flightService.getFlightById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with ID: " + id));
        return ResponseEntity.ok(flightService.toDto(flight));
    }

    @GetMapping
    public ResponseEntity<List<FlightDto>> getAllFlights() {
        List<Flight> flights = flightService.getAllFlights();
        if (flights.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        List<FlightDto> dtos = flights.stream()
                .map(flightService::toDto)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<FlightDto> updateFlight(@Valid @PathVariable Long id, @RequestBody FlightDto req) {
        Flight updatedFlight = flightService.updateFlight(id, req);
        return ResponseEntity.ok(flightService.toDto(updatedFlight));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteFlight(@PathVariable Long id) {
        flightService.deleteFlight(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<FlightDto>> searchFlight(
            @ModelAttribute FlightSearchCriteriaDto criteriaDto) {

        List<Flight> flights = flightService.searchFlights(criteriaDto);

        List<FlightDto> dtos = flights.stream()
                .map(flightService::toDto)
                .toList();

        if (dtos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(dtos);
    }
}