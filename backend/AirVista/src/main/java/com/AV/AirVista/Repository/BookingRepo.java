package com.AV.AirVista.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.AV.AirVista.Model.Booking;

public interface BookingRepo extends JpaRepository<Booking, Long> {

}
