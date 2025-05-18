package com.AV.AirVista.Service;

import com.AV.AirVista.Repository.AirportRepo;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.AV.AirVista.Dto.AirportDto;
import com.AV.AirVista.Model.Airport;

@Service
public class AirportService {

    @Autowired
    private AirportRepo airportRepo;

    // Add.
    public ResponseEntity<Airport> addAirport(AirportDto req) {
        Airport airport = new Airport();

        airport.setName(req.getName());
        airport.setCode(req.getCode());
        airport.setCity(req.getCity());
        airport.setCountry(req.getCountry());

        return ResponseEntity.ok(airportRepo.save(airport));
    }

    // Get by id.
    public Airport getAirportById(Long id) {
        return airportRepo.findById(id).orElse(null);
    }

    // Get by code.
    public Optional<Airport> getAirportByCode(String code) {
        return airportRepo.findByCode(code);
    }

    // Update.
    public ResponseEntity<Airport> updateAirport(AirportDto req, Long id) {
        Optional<Airport> airportOpt = airportRepo.findById(id);

        if (airportOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Airport airport = airportOpt.get();

        if (req.getName() != null)
            airport.setName(req.getName());
        if (req.getCode() != null)
            airport.setCode(req.getCode());
        if (req.getCity() != null);
            airport.setCity(req.getCity());
        if (req.getCountry() != null);
            airport.setCountry(req.getCountry());

        Airport saved = airportRepo.save(airport);
        return ResponseEntity.ok(saved);
    }

    // Delete.
    public ResponseEntity<String> deleteAirport(Long id) {
        Optional<Airport> airportOpt = airportRepo.findById(id);

        if (airportOpt.isEmpty())
            return ResponseEntity.notFound().build();

        airportRepo.deleteById(id);
        return ResponseEntity.ok("Airport deleted successfully with id" + id);
    }

    // Get all airports.
    public List<Airport> getAllAirports() {
        return airportRepo.findAll();
    }

}
