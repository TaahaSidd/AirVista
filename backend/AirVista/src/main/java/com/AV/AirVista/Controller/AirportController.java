package com.AV.AirVista.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.AV.AirVista.Dto.AirportDto;
import com.AV.AirVista.Exception.ResourceNotFoundException;
import com.AV.AirVista.Model.Airport;
import com.AV.AirVista.Service.AirportService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("AirVista/Airport")
@RequiredArgsConstructor
public class AirportController {

    private final AirportService airportService;

    // Add Airport
    @PostMapping("/add")
    public ResponseEntity<Airport> addAirports(@Valid @RequestBody AirportDto req) {
        Airport savedAirport = airportService.addAirport(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAirport);
    }

    // Get Airport by ID
    @GetMapping("byId/{id}")
    public ResponseEntity<Airport> getAirportById(@PathVariable Long id) {
        Airport airport = airportService.getAirportById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Airport not found with ID: " + id));
        return ResponseEntity.ok(airport);
    }

    // Get Airport by Code
    @GetMapping("code/{code}")
    public ResponseEntity<Airport> getAirportByCode(@PathVariable String code) {
        return airportService.getAirportByCode(code)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Airport not found with Code: " + code));
    }

    // Get All Airports
    @GetMapping
    public ResponseEntity<List<Airport>> getAllAirports() {
        List<Airport> airports = airportService.getAllAirports();
        return ResponseEntity.ok(airports);
    }

    // Update Airport
    @PutMapping("update/{id}")
    public ResponseEntity<Airport> updateAirport(@PathVariable Long id, @Valid @RequestBody AirportDto req) {
        Airport updatedAirport = airportService.updateAirport(req, id);
        return ResponseEntity.ok(updatedAirport);
    }

    // Delete Airport
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAirport(@PathVariable Long id) {

        airportService.deleteAirport(id);
        return ResponseEntity.noContent().build();
    }
}