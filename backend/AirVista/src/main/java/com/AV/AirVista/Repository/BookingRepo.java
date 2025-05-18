package com.AV.AirVista.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.AV.AirVista.Model.Booking;

public interface BookingRepo extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long id);

    List<Booking> findByFlightId(Long id);
}
