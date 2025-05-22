package com.AV.AirVista.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.AV.AirVista.Dto.PassengerDto;
import com.AV.AirVista.Model.Passenger;
import com.AV.AirVista.Service.PassengerService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/AirVista/Passenger")
public class PassengerController {

    @Autowired
    private PassengerService passengerService;

    @PostMapping("/add")
    public ResponseEntity<Passenger> addPassneger(@Valid @RequestBody PassengerDto req) {
        return passengerService.addPassenger(req);
    }

    @GetMapping("{id}")
    public ResponseEntity<Passenger> getPassengerById(@Valid @PathVariable Long id) {
        return passengerService.getPassengerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<PassengerDto>> getAllPassenger() {
        List<Passenger> passengers = passengerService.getAllPassenger();
        List<PassengerDto> dtos = passengers.stream()
                .map(passengerService::toDto)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("update/{id}")
    public ResponseEntity<Passenger> updatePassenger(@Valid @PathVariable Long id, @RequestBody PassengerDto req) {
        return passengerService.updatePassenger(id, req);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deletePassenger(@Valid @PathVariable Long id) {
        return passengerService.deletePassenger(id);
    }

}
