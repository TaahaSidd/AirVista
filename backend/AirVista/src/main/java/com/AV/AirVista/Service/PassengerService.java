package com.AV.AirVista.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.AV.AirVista.Dto.PassengerDto;
import com.AV.AirVista.Model.Passenger;
import com.AV.AirVista.Repository.PassengerRepo;

@Service
public class PassengerService {

    @Autowired
    private PassengerRepo passengerRepo;

    public ResponseEntity<Passenger> addPassenger(PassengerDto req) {
        Passenger passenger = new Passenger();

        passenger.setName(req.getName());
        passenger.setEmail(req.getEmail());
        passenger.setPhone(req.getPhone());

        return ResponseEntity.ok(passengerRepo.save(passenger));
    }

    public Optional<Passenger> getPassengerById(Long id) {
        return passengerRepo.findById(id);
    }

    public ResponseEntity<Passenger> updatePassenger(Long id, PassengerDto req) {
        Optional<Passenger> passengerOpt = passengerRepo.findById(id);

        if (passengerOpt.isEmpty())
            return ResponseEntity.notFound().build();

        Passenger passenger = passengerOpt.get();

        if (req.getName() != null)
            passenger.setName(req.getName());
        if (req.getEmail() != null)
            passenger.setEmail(req.getEmail());
        if (req.getPhone() != null)
            passenger.setPhone(req.getPhone());

        Passenger saved = passengerRepo.save(passenger);
        return ResponseEntity.ok(saved);
    }

    public ResponseEntity<String> deletePassenger(Long id) {
        Optional<Passenger> passengerOpt = passengerRepo.findById(id);

        if (passengerOpt.isEmpty())
            return ResponseEntity.notFound().build();

        passengerRepo.deleteById(id);
        return ResponseEntity.ok("Passenger deleted with id " + id);
    }

    public List<Passenger> getAllPassenger() {
        return passengerRepo.findAll();
    }

    public PassengerDto toDto(Passenger passenger) {
        return PassengerDto.builder()
                .id(passenger.getId())
                .name(passenger.getName())
                .email(passenger.getEmail())
                .phone(passenger.getPhone())
                .build();
    }
}
