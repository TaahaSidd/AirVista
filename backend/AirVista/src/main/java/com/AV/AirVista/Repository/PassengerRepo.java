package com.AV.AirVista.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.AV.AirVista.Model.Passenger;

public interface PassengerRepo extends JpaRepository<Passenger, Long> {

}
