package com.AV.AirVista.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.AV.AirVista.Model.Enums.SeatStatus;
import com.AV.AirVista.Model.Flight;
import com.AV.AirVista.Model.Seat;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByFlight(Optional<Flight> flight);

    Optional<Seat> findByFlightAndSeatNumber(Flight flight, String seatNumber);

    List<Seat> findByFlightAndStatus(Flight flight, SeatStatus status);
}
