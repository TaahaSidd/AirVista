package com.AV.AirVista.Repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.AV.AirVista.Model.Flight;

public interface FlightRepo extends JpaRepository<Flight, Long> {
    @Query(value = "SELECT f.* FROM flight f " +
            "JOIN airport origin_airport ON f.origin_id = origin_airport.id " +
            "JOIN airport destination_airport ON f.destination_id = destination_airport.id " +
            "WHERE DATE(f.dept_time) = :date " +
            "AND origin_airport.code = :originCode " +
            "AND destination_airport.code = :destinationCode", nativeQuery = true)
    List<Flight> searchFlights(@Param("originCode") String originCode,
            @Param("destinationCode") String destinationCode,
            @Param("date") LocalDate date);

}
