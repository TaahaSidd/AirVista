package com.AV.AirVista.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.AV.AirVista.Service.PassengerService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.AV.AirVista.Dto.PassengerDto;
import com.AV.AirVista.Model.Passenger;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/Passenger")
public class PassengerController {

    @Autowired
    private PassengerService passengerService;

    @PostMapping("/add")
    public ResponseEntity<Passenger> addPassneger(@Valid @RequestBody PassengerDto req) {
        return passengerService.addPassenger(req);
    }

    @GetMapping("{id}")
    public Optional<Passenger> getPassengerById(@Valid @RequestParam Long id) {
        return passengerService.getPassengerById(id);
    }

    @GetMapping
    public List<Passenger> getAllPassenger() {
        return passengerService.getAllPassenger();
    }

    @PutMapping("update/{id}")
    public ResponseEntity<Passenger> updatePassenger(@Valid @PathVariable Long id, @RequestBody PassengerDto req) {
        return passengerService.updatePassenger(req);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deletePassenger(@Valid @PathVariable Long id) {
        return passengerService.deletePassenger(id);
    }

}
