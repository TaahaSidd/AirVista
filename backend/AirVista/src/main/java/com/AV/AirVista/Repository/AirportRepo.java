package com.AV.AirVista.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.AV.AirVista.Model.Airport;

public interface AirportRepo extends JpaRepository<Airport, Long> {
    Optional<Airport> findByCode(String code);
}
