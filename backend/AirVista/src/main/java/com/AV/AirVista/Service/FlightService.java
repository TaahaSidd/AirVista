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

        Airport origin = airportRepo.findByCode(req.getOriginCode())
                .orElseThrow(() -> new RuntimeException("Origin airport not found"));

        Airport destination = airportRepo.findByCode(req.getDestinationCode())
                .orElseThrow(() -> new RuntimeException("Destination airport not found"));

        Flight flight = new Flight();

        flight.setFlightNumber(req.getFlightNumber());
        flight.setOrigin(origin);
        flight.setDestination(destination);
        flight.setDeptTime(req.getDeptTime());
        flight.setArrTime(req.getArrTime());
        flight.setSeats(req.getSeats());
        flight.setPrice(req.getPrice());

        return ResponseEntity.ok(flightRepo.save(flight));
    }

    public Flight getFlightById(Long id) {
        return flightRepo.findById(id).orElse(null);
    }

    public ResponseEntity<Flight> updateFlight(Long id, FlightDto req) {
        Optional<Flight> flightOpt = flightRepo.findById(id);
        Flight flight = flightOpt.get();

        if (flightOpt.isEmpty())
            return ResponseEntity.notFound().build();

        if (req.getOriginCode() != null) {
            Airport origin = airportRepo.findByCode(req.getOriginCode())
                    .orElseThrow(
                            () -> new RuntimeException("Origin airport not found for update:" + req.getOriginCode()));
            flight.setOrigin(origin);
        }
        if (req.getDestinationCode() != null) {
            Airport destination = airportRepo.findByCode(req.getDestinationCode())
                    .orElseThrow(() -> new RuntimeException(
                            "Destination airport not found for update: " + req.getDestinationCode()));
            flight.setDestination(destination);
        }
        if (req.getFlightNumber() != null)
            flight.setFlightNumber(req.getFlightNumber());
        if (req.getDeptTime() != null)
            flight.setDeptTime(req.getDeptTime());
        if (req.getArrTime() != null)
            flight.setArrTime(req.getArrTime());
        if (req.getSeats() != null)
            flight.setSeats(req.getSeats());
        if (req.getPrice() != 0.0)
            flight.setPrice(req.getPrice());

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
                .originCode(flight.getOrigin().getCode())
                .destinationCode(flight.getDestination().getCode())
                .deptTime(flight.getDeptTime())
                .arrTime(flight.getArrTime())
                .seats(flight.getSeats())
                .price(flight.getPrice())
                .build();
    }
}
