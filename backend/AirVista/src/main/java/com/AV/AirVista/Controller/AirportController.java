package com.AV.AirVista.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.AV.AirVista.Service.AirportService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.AV.AirVista.Dto.AirportDto;
import com.AV.AirVista.Model.Airport;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/Airport")
public class AirportController {

    @Autowired
    private AirportService airportService;

    @PostMapping("/add")
    public ResponseEntity<Airport> addAirports(@Valid @RequestBody AirportDto req) {
        return airportService.addAirport(req);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Airport> getAirportById(@Valid @RequestParam Long id) {
        Airport airport = airportService.getAirportById(id);
        if (airport == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(airport);
    }

    @GetMapping("/{code}")
    public ResponseEntity<Airport> getAirportByCode(@RequestParam String code) {
        return airportService.getAirportByCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Airport>> getAllAiports() {
        List<Airport> airports = airportService.getAllAirports();
        return ResponseEntity.ok(airports);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Airport> updateAiport(@PathVariable Long id, @Valid @RequestBody AirportDto req) {
        return airportService.updateAirport(req, id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAirport(@PathVariable Long id) {
        return airportService.deleteAirport(id);
    }
}
