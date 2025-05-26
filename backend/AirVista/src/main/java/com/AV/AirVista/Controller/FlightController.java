package com.AV.AirVista.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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
    public ResponseEntity<Optional<Flight>> getFlightById(@PathVariable Long id) {
        Optional<Flight> flight = flightService.getFlightById(id);
        if (flight == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(flight);
    }

    @GetMapping
    public ResponseEntity<List<Flight>> getAllFlights() {
        List<Flight> flights = flightService.getAllFlights();
        if (flights.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(flights);
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
