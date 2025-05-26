package com.AV.AirVista.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.AV.AirVista.Model.Flight;
import com.AV.AirVista.Model.Seat;
import com.AV.AirVista.Repository.SeatRepository;
import com.AV.AirVista.Service.FlightService;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("AirVista/seats")
@RequiredArgsConstructor
public class SeatController {

    private final SeatRepository seatRepo;
    private final FlightService flightService;

    @GetMapping("/flight/{flightId}")
    public ResponseEntity<List<Seat>> getSeatByFlight(@PathVariable Long flightId) {
        Optional<Flight> flight = flightService.getFlightById(flightId);

        if (flight == null)
            return ResponseEntity.notFound().build();

        List<Seat> seats = seatRepo.findByFlight(flight);

        if (seats.isEmpty())
            return ResponseEntity.noContent().build();

        return ResponseEntity.ok(seats);

    }

}
