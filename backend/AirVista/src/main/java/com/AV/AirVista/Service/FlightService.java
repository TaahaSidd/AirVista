package com.AV.AirVista.Service;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.AV.AirVista.Dto.FlightDto;
import com.AV.AirVista.Dto.FlightSearchCriteriaDto;
import com.AV.AirVista.Exception.ResourceNotFoundException;
import com.AV.AirVista.Model.Airport;
import com.AV.AirVista.Model.Enums.CabinClass;
import com.AV.AirVista.Model.Enums.SeatStatus;
import com.AV.AirVista.Model.Flight;
import com.AV.AirVista.Model.Seat;
import com.AV.AirVista.Repository.AirportRepo;
import com.AV.AirVista.Repository.FlightRepo;
import com.AV.AirVista.Repository.SeatRepository;
import com.AV.AirVista.Repository.Specification.FlightSpecification;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FlightService {

    private static final Logger logger = LoggerFactory.getLogger(FlightService.class);

    private final FlightRepo flightRepo;
    private final SeatRepository seatRepo;
    private final AirportRepo airportRepo;

    // --- CRUD Operations ---
    @Transactional
    public Flight addFlight(FlightDto req) {
        Airport origin = airportRepo.findByCode(req.getOriginCode())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Origin airport not found with code: " + req.getOriginCode()));

        Airport destination = airportRepo.findByCode(req.getDestinationCode())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Destination airport not found with code: " + req.getDestinationCode()));

        Flight flight = new Flight();
        flight.setFlightNumber(req.getFlightNumber());
        flight.setOrigin(origin);
        flight.setDestination(destination);
        flight.setDeptTime(req.getDeptTime());
        flight.setArrTime(req.getArrTime());
        flight.setPrice(req.getPrice());
        flight.setSeats(req.getSeats());
        flight.setStops(req.getStops());
        flight.setAirline(req.getAirline());
        flight.setCabinClass(req.getCabinClass());
        flight.setFlightStatus("SCHEDULED");
        flight.setStatusMessage("Flight scheduled normally.");

        return saveFlight(flight);
    }

    public Optional<Flight> getFlightById(Long id) {
        return flightRepo.findById(id);
    }

    @Transactional
    public Flight updateFlight(Long id, FlightDto req) {
        Flight flight = flightRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with ID: " + id));

        if (req.getOriginCode() != null) {
            Airport origin = airportRepo.findByCode(req.getOriginCode())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Origin airport not found for update: " + req.getOriginCode()));
            flight.setOrigin(origin);
        }
        if (req.getDestinationCode() != null) {
            Airport destination = airportRepo.findByCode(req.getDestinationCode())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Destination airport not found for update: " + req.getDestinationCode()));
            flight.setDestination(destination);
        }
        if (req.getFlightNumber() != null)
            flight.setFlightNumber(req.getFlightNumber());
        if (req.getDeptTime() != null)
            flight.setDeptTime(req.getDeptTime());
        if (req.getArrTime() != null)
            flight.setArrTime(req.getArrTime());
        if (req.getPrice() != null)
            flight.setPrice(req.getPrice());
        if (req.getSeats() != null)
            flight.setSeats(req.getSeats());
        if (req.getStops() != null)
            flight.setStops(req.getStops());
        if (req.getAirline() != null)
            flight.setAirline(req.getAirline());
        if (req.getCabinClass() != null)
            flight.setCabinClass(req.getCabinClass());

        if (req.getFlightStatus() != null)
            flight.setFlightStatus(req.getFlightStatus());
        if (req.getStatusMessage() != null)
            flight.setStatusMessage(req.getStatusMessage());
        if (req.getActualDeptTime() != null)
            flight.setActualDeptTime(req.getActualDeptTime());
        if (req.getDepTerminal() != null)
            flight.setDepTerminal(req.getDepTerminal());
        if (req.getDepGate() != null)
            flight.setDepGate(req.getDepGate());
        if (req.getDepDelay() != null)
            flight.setDepDelay(req.getDepDelay());
        if (req.getActualArrTime() != null)
            flight.setActualArrTime(req.getActualArrTime());
        if (req.getArrTerminal() != null)
            flight.setArrTerminal(req.getArrTerminal());
        if (req.getArrGate() != null)
            flight.setArrGate(req.getArrGate());
        if (req.getArrDelay() != null)
            flight.setArrDelay(req.getArrDelay());

        return flightRepo.save(flight);
    }

    @Transactional
    public void deleteFlight(Long id) {
        if (!flightRepo.existsById(id)) {
            throw new ResourceNotFoundException("Flight not found with ID: " + id);
        }
        flightRepo.deleteById(id);
    }

    public List<Flight> getAllFlights() {
        return flightRepo.findAll();
    }

    // --- DTO Conversion ---
    public FlightDto toDto(Flight flight) {

        String originCode = (flight.getOrigin() != null) ? flight.getOrigin().getCode() : null;
        String destinationCode = (flight.getDestination() != null) ? flight.getDestination().getCode() : null;

        return FlightDto.builder()
                .id(flight.getId())
                .flightNumber(flight.getFlightNumber())
                .originCode(originCode)
                .destinationCode(destinationCode)
                .deptTime(flight.getDeptTime())
                .arrTime(flight.getArrTime())
                .price(flight.getPrice())
                .seats(flight.getSeats())
                .stops(flight.getStops())
                .airline(flight.getAirline())
                .cabinClass(flight.getCabinClass())
                // Live tracking fields
                .flightStatus(flight.getFlightStatus())
                .statusMessage(flight.getStatusMessage())
                .actualDeptTime(flight.getActualDeptTime())
                .depTerminal(flight.getDepTerminal())
                .depGate(flight.getDepGate())
                .depDelay(flight.getDepDelay())
                .actualArrTime(flight.getActualArrTime())
                .arrTerminal(flight.getArrTerminal())
                .arrGate(flight.getArrGate())
                .arrDelay(flight.getArrDelay())
                .build();
    }

    // --- Search Functionality ---
    public List<Flight> searchFlights(FlightSearchCriteriaDto criteria) {
        Specification<Flight> spec = Specification.where(null);

        if (criteria.getOriginCity() != null && !criteria.getOriginCity().isEmpty()) {
            spec = spec.and(FlightSpecification.hasOriginCity(criteria.getOriginCity()));
        }
        if (criteria.getDestinationCity() != null && !criteria.getDestinationCity().isEmpty()) {
            spec = spec.and(FlightSpecification.hasDestinationCity(criteria.getDestinationCity()));
        }
        if (criteria.getDeptDate() != null) {
            spec = spec.and(FlightSpecification.hasDepartureDate(criteria.getDeptDate()));
        }
        if (criteria.getAirline() != null && !criteria.getAirline().isEmpty()) {
            spec = spec.and(FlightSpecification.hasAirline(criteria.getAirline()));
        }
        if (criteria.getMinStops() != null) {
            spec = spec.and(FlightSpecification.hasMinStops(criteria.getMinStops()));
        }
        if (criteria.getMaxStops() != null) {
            spec = spec.and(FlightSpecification.hasMaxStops(criteria.getMaxStops()));
        }
        if (criteria.getMinPrice() != null) {
            spec = spec.and(FlightSpecification.hasMinPrice(criteria.getMinPrice()));
        }
        if (criteria.getMaxPrice() != null) {
            spec = spec.and(FlightSpecification.hasMaxPrice(criteria.getMaxPrice()));
        }
        if (criteria.getCabinClass() != null) {
            spec = spec.and(FlightSpecification.hasCabinClass(criteria.getCabinClass()));
        }
        if (criteria.getMinDepTime() != null) {
            spec = spec.and(FlightSpecification.hasMinDepartureTime(criteria.getMinDepTime()));
        }
        if (criteria.getMaxDepTime() != null) {
            spec = spec.and(FlightSpecification.hasMaxDepartureTime(criteria.getMaxDepTime()));
        }
        if (criteria.getPassengers() != null && criteria.getPassengers() > 0) {
            spec = spec.and(FlightSpecification.hasAvailableSeats(criteria.getPassengers()));
        }

        return flightRepo.findAll(spec);
    }

    // --- Seat Management ---
    @Transactional
    public Flight saveFlight(Flight flight) {
        Flight savedFlight = flightRepo.save(flight);

        if (savedFlight.getSeatsLayout() == null || savedFlight.getSeatsLayout().isEmpty()) {
            generateSeatsForFlight(savedFlight);
        }
        return savedFlight;
    }

    private void generateSeatsForFlight(Flight flight) {
        if (flight.getSeats() == null || flight.getSeats() <= 0) {
            logger.warn("Cannot generate seats for flight {} with no seats defined or seats <= 0. Total seats: {}",
                    flight.getFlightNumber(), flight.getSeats()); // Using logger
            return;
        }

        Set<Seat> seats = new HashSet<>();
        int totalSeats = flight.getSeats();
        int currentRow = 1;
        char currentCol = 'A';
        int seatsPerRow = 6;

        for (int i = 0; i < totalSeats; i++) {
            Seat seat = new Seat();
            seat.setFlight(flight);
            seat.setSeatNumber(String.format("%d%c", currentRow, currentCol));
            seat.setSeatRow(String.valueOf(currentRow));
            seat.setSeatColumn(String.valueOf(currentCol));
            seat.setStatus(SeatStatus.AVAILABLE);
            seat.setPricePremium(BigDecimal.ZERO);

            if (currentCol == 'A' || currentCol == (char) ('A' + seatsPerRow - 1)) {
                seat.setWindow(true);
            } else if (seatsPerRow == 6 && (currentCol == 'C' || currentCol == 'D')) {
                seat.setAisle(true);
            } else if (seatsPerRow == 4 && (currentCol == 'B' || currentCol == 'C')) {
                seat.setAisle(true);
            }

            // Price premium based on cabin class and row
            if (flight.getCabinClass() == CabinClass.BUSINESS && currentRow <= 5) {
                seat.setPricePremium(new BigDecimal("50.00"));
                seat.setWindow(true);
                seat.setAisle(true);
            } else if (flight.getCabinClass() == CabinClass.FIRST_CLASS && currentRow <= 2) {
                seat.setPricePremium(new BigDecimal("100.00"));
                seat.setWindow(true);
                seat.setAisle(true);
            }

            seats.add(seat);

            currentCol++;
            if (currentCol > (char) ('A' + seatsPerRow - 1)) {
                currentCol = 'A';
                currentRow++;
            }
        }
        seatRepo.saveAll(seats);
        flight.setSeatsLayout(seats);
    }

}
