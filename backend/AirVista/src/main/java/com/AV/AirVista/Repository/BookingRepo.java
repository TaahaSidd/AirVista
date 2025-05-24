package com.AV.AirVista.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.AV.AirVista.Model.AppUser;
import com.AV.AirVista.Model.Booking;

public interface BookingRepo extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long id);

    List<Booking> findByUser(AppUser user);

    Optional<Booking> findByIdAndUser(Long id, AppUser user);

    List<Booking> findByFlightId(Long id);
}
