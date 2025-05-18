package com.AV.AirVista.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.AV.AirVista.Dto.FlightDto;
import com.AV.AirVista.Model.Flight;
import com.AV.AirVista.Repository.FlightRepo;

@Service
public class FlightService {

    @Autowired
    private FlightRepo flightRepo;

    public ResponseEntity<Flight> addFlight(FlightDto req) {
        Flight flight = new Flight();

        flight.setFlighnumber(req.getFlightNumber());
        flight.setOrigin(req.getOrigin());
        flight.setDestination(req.getDestination());
        flight.setDeptTime(req.getDepTime());
        flight.setArrTime(req.getArrTime());
        flight.setSeats(req.getSeats());

        return ResponseEntity.ok(flightRepo.save(flight));
    }

    public Flight getFlightById(Long id) {
        return flightRepo.findById(id).orElse(null);
    }

    public ResponseEntity<Flight> updateFlight(FlightDto req) {
        Optional<Flight> flightOpt = flightRepo.findById(req.getId());

        if (flightOpt.isEmpty())
            return ResponseEntity.notFound().build();

        Flight flight = flightOpt.get();

        if (req.getFlightNumber() != null)
            flight.setFlighnumber(req.getFlightNumber());
        if (req.getOrigin() != null)
            flight.setOrigin(req.getOrigin());
        if (req.getDestination() != null)
            flight.setDestination(req.getDestination());
        if (req.getDepTime() != null)
            flight.setDeptTime(req.getDepTime());
        if (req.getArrTime() != null)
            flight.setArrTime(req.getArrTime());
        if (req.getSeats() != null)
            flight.setSeats(req.getSeats());

        Flight saved = flightRepo.save(flight);
        return ResponseEntity.ok(saved);
    }

    public ResponseEntity<String> deleteFlight(Long id) {
        Optional<Flight> flightOpt = flightRepo.findById(id);

        if (flightOpt.isEmpty())
            return ResponseEntity.notFound().build();

        flightRepo.deleteById(id);
        return ResponseEntity.ok("Flight deleted successfully with id" + id);
    }

    public ResponseEntity<List<Flight>> sesarchFlights(String origin, String destination, LocalDate date) {
        return ResponseEntity.ok(flightRepo.searchFlights(origin, destination, date));
    }

    public List<Flight> getAllFlights(){
        return flightRepo.findAll();
    }
}
