package com.AV.AirVista.Repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.AV.AirVista.Model.Flight;

public interface FlightRepo extends JpaRepository<Flight, Long> {
    @Query(value = "SELECT * FROM flight WHERE DATE(dep_time) = :date AND origin = :origin AND destination = :destination", nativeQuery = true)
    List<Flight> searchFlights(@Param("origin") String origin,
            @Param("destination") String destination,
            @Param("date") LocalDate date);

}
