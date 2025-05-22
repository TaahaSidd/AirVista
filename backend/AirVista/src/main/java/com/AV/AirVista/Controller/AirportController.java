package com.AV.AirVista.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.AV.AirVista.Model.Airport;
import com.AV.AirVista.Service.AirportService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("AirVista/Airport")
public class AirportController {

    @Autowired
    private AirportService airportService;

    @PostMapping("/add")
    public ResponseEntity<Airport> addAirports(@Valid @RequestBody AirportDto req) {
        return airportService.addAirport(req);
    }

    @GetMapping("byId/{id}")
    public ResponseEntity<Airport> getAirportById(@Valid @PathVariable Long id) {
        Airport airport = airportService.getAirportById(id);
        if (airport == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(airport);
    }

    @GetMapping("code/{code}")
    public ResponseEntity<Airport> getAirportByCode(@PathVariable String code) {
        return airportService.getAirportByCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Airport>> getAllAiports() {
        List<Airport> airports = airportService.getAllAirports();
        return ResponseEntity.ok(airports);
    }

    @PutMapping("update/{id}")
    public ResponseEntity<Airport> updateAiport(@PathVariable Long id, @Valid @RequestBody AirportDto req) {
        return airportService.updateAirport(req, id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAirport(@PathVariable Long id) {
        return airportService.deleteAirport(id);
    }
}
