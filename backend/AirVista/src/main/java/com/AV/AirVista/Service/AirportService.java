package com.AV.AirVista.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.AV.AirVista.Dto.AirportDto;
import com.AV.AirVista.Exception.ResourceNotFoundException;
import com.AV.AirVista.Model.Airport;
import com.AV.AirVista.Repository.AirportRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AirportService {

    private final AirportRepo airportRepo;

    public Airport addAirport(AirportDto req) {

        Airport airport = new Airport();
        airport.setName(req.getName());
        airport.setCode(req.getCode());
        airport.setCity(req.getCity());
        airport.setCountry(req.getCountry());
        return airportRepo.save(airport);
    }

    public Optional<Airport> getAirportById(Long id) {
        return airportRepo.findById(id);
    }

    public Optional<Airport> getAirportByCode(String code) {
        if (code == null) {
            return Optional.empty();
        }
        return airportRepo.findByCode(code.toUpperCase());
    }

    // Update Airport
    public Airport updateAirport(AirportDto req, Long id) {
        Airport airport = airportRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Airport not found with ID: " + id));

        if (req.getName() != null)
            airport.setName(req.getName());
        if (req.getCode() != null)
            airport.setCode(req.getCode());
        if (req.getCity() != null)
            airport.setCity(req.getCity());
        if (req.getCountry() != null)
            airport.setCountry(req.getCountry());

        return airportRepo.save(airport);
    }

    // Delete Airport
    public void deleteAirport(Long id) {
        if (!airportRepo.existsById(id)) {
            throw new ResourceNotFoundException("Airport not found with ID: " + id);
        }
        airportRepo.deleteById(id);
    }

    // Get all airports
    public List<Airport> getAllAirports() {
        return airportRepo.findAll();
    }
}
