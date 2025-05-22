package com.AV.AirVista.Controller;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.AV.AirVista.Dto.FlightDto;
import com.AV.AirVista.Model.Flight;
import com.AV.AirVista.Service.FlightService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("AirVista/Flight")
public class FlightController {

    @Autowired
    private FlightService flightService;

    @PostMapping("/add")
    public ResponseEntity<Flight> addFlight(@Valid @RequestBody FlightDto req) {
        return flightService.addFlight(req);
    }

    @GetMapping("/byId/{id}")
    public ResponseEntity<Flight> getFlightById(@PathVariable Long id) {
        Flight flight = flightService.getFlightById(id);
        if (flight == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(flight);
    }

    @GetMapping
    public List<Flight> getAllFlights() {
        return flightService.getAllFlights();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Flight> updateFlight(@Valid @PathVariable Long id, @RequestBody FlightDto req) {
        return flightService.updateFlight(id, req);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteFlight(@PathVariable Long id) {
        return flightService.deleteFlight(id);
    }

    @GetMapping("/search")
    public ResponseEntity<List<FlightDto>> searchFlight(@RequestParam String origin, @RequestParam String destination,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<Flight> flights = Optional.ofNullable(flightService.searchFlights(origin, destination, date))
                .orElse(Collections.emptyList());

        List<FlightDto> dtos = flights.stream()
                .map(flightService::toDto)
                .toList();
        return ResponseEntity.ok(dtos);
    }

}
