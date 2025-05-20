package com.AV.AirVista.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.AV.AirVista.Dto.FlightDto;
import com.AV.AirVista.Model.Airport;
import com.AV.AirVista.Model.Flight;
import com.AV.AirVista.Repository.AirportRepo;
import com.AV.AirVista.Repository.FlightRepo;

@Service
public class FlightService {

    @Autowired
    private FlightRepo flightRepo;

    @Autowired
    private AirportRepo airportRepo;

    public ResponseEntity<Flight> addFlight(FlightDto req) {

        Airport origin = airportRepo.findById(req.getOriginId())
                .orElseThrow(() -> new RuntimeException("Origin airport not found"));

        Airport destination = airportRepo.findById(req.getDestinationId())
                .orElseThrow(() -> new RuntimeException("Destination airport not found"));

        Flight flight = new Flight();

        flight.setFlightNumber(req.getFlightNumber());
        flight.setOrigin(origin);
        flight.setDestination(destination);
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

        Airport origin = airportRepo.findById(req.getOriginId())
                .orElseThrow(() -> new RuntimeException("Origin airport not found"));

        Airport destination = airportRepo.findById(req.getDestinationId())
                .orElseThrow(() -> new RuntimeException("Destination airport not found"));

        Flight flight = flightOpt.get();

        if (req.getFlightNumber() != null)
            flight.setFlightNumber(req.getFlightNumber());
        if (origin != null)
            flight.setOrigin(origin);
        if (destination != null)
            flight.setDestination(destination);
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

    public List<Flight> searchFlights(String origin, String destination, LocalDate date) {
        return flightRepo.searchFlights(origin, destination, date);
    }

    public List<Flight> getAllFlights() {
        return flightRepo.findAll();
    }

    public FlightDto toDto(Flight flight) {
        return FlightDto.builder()
                .id(flight.getId())
                .flightNumber(flight.getFlightNumber())
                .originId(flight.getOrigin().getId())
                .originCode(flight.getOrigin().getCode())
                .destinationId(flight.getDestination().getId())
                .destinationCode(flight.getDestination().getCode())
                .depTime(flight.getDeptTime())
                .arrTime(flight.getArrTime())
                .seats(flight.getSeats())
                .price(flight.getPrice())
                .build();
    }
}
