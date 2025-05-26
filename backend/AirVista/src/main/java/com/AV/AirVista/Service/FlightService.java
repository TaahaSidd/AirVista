package com.AV.AirVista.Service;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.AV.AirVista.Dto.FlightDto;
import com.AV.AirVista.Dto.FlightSearchCriteriaDto;
import com.AV.AirVista.Model.Airport;
import com.AV.AirVista.Model.Flight;
import com.AV.AirVista.Model.Seat;
import com.AV.AirVista.Model.Enums.CabinClass;
import com.AV.AirVista.Model.Enums.SeatStatus;
import com.AV.AirVista.Repository.AirportRepo;
import com.AV.AirVista.Repository.FlightRepo;
import com.AV.AirVista.Repository.SeatRepository;
import com.AV.AirVista.Repository.Specification.FlightSpecification;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FlightService {

    private final FlightRepo flightRepo;
    private final SeatRepository seatRepo;
    private final AirportRepo airportRepo;

    public ResponseEntity<Flight> addFlight(FlightDto req) {

        Airport origin = airportRepo.findByCode(req.getOriginCode())
                .orElseThrow(() -> new RuntimeException("Origin airport not found"));

        Airport destination = airportRepo.findByCode(req.getDestinationCode())
                .orElseThrow(() -> new RuntimeException("Destination airport not found"));

        Flight flight = new Flight();

        flight.setFlightNumber(req.getFlightNumber());
        flight.setOrigin(origin);
        flight.setDestination(destination);
        flight.setDeptTime(req.getDeptTime());
        flight.setArrTime(req.getArrTime());
        flight.setSeats(req.getSeats());
        flight.setPrice(req.getPrice());

        return ResponseEntity.ok(flightRepo.save(flight));
    }

    public Optional<Flight> getFlightById(Long id) {
        return flightRepo.findById(id);
    }

    public ResponseEntity<Flight> updateFlight(Long id, FlightDto req) {
        Optional<Flight> flightOpt = flightRepo.findById(id);

        if (flightOpt.isEmpty())
            return ResponseEntity.notFound().build();

        Flight flight = flightOpt.get();

        if (req.getOriginCode() != null) {
            Airport origin = airportRepo.findByCode(req.getOriginCode())
                    .orElseThrow(
                            () -> new RuntimeException("Origin airport not found for update:" + req.getOriginCode()));
            flight.setOrigin(origin);
        }
        if (req.getDestinationCode() != null) {
            Airport destination = airportRepo.findByCode(req.getDestinationCode())
                    .orElseThrow(() -> new RuntimeException(
                            "Destination airport not found for update: " + req.getDestinationCode()));
            flight.setDestination(destination);
        }
        if (req.getFlightNumber() != null)
            flight.setFlightNumber(req.getFlightNumber());
        if (req.getDeptTime() != null)
            flight.setDeptTime(req.getDeptTime());
        if (req.getArrTime() != null)
            flight.setArrTime(req.getArrTime());
        if (req.getSeats() != null)
            flight.setSeats(req.getSeats());
        if (req.getPrice() != null && req.getPrice().compareTo(BigDecimal.ZERO) != 0)
            flight.setPrice(req.getPrice());

        Flight saved = flightRepo.save(flight);
        return ResponseEntity.ok(saved);
    }

    public ResponseEntity<String> deleteFlight(Long id) {
        Optional<Flight> flightOpt = flightRepo.findById(id);

        if (flightOpt.isEmpty())
            return ResponseEntity.notFound().build();

        flightRepo.deleteById(id);
        return ResponseEntity.ok("Flight deleted successfully with id" + id);
    }

    public List<Flight> getAllFlights() {
        return flightRepo.findAll();
    }

    public FlightDto toDto(Flight flight) {
        return FlightDto.builder()
                .id(flight.getId())
                .flightNumber(flight.getFlightNumber())
                .originCode(flight.getOrigin().getCode())
                .destinationCode(flight.getDestination().getCode())
                .deptTime(flight.getDeptTime())
                .arrTime(flight.getArrTime())
                .seats(flight.getSeats())
                .price(flight.getPrice())
                .build();
    }

    public List<Flight> searchFlights(FlightSearchCriteriaDto criteria) {
        Specification<Flight> spec = Specification.where(null);

        // --- Apply Filters based on available criteria ---
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

    @Transactional
    public Flight saveFlight(Flight flight) {
        // First save the flight to get its ID
        Flight savedFlight = flightRepo.save(flight);

        // If seats are not already generated for this flight, generate them
        if (savedFlight.getSeatsLayout() == null || savedFlight.getSeatsLayout().isEmpty()) {
            generateSeatsForFlight(savedFlight);
        }
        return savedFlight;
    }

    private void generateSeatsForFlight(Flight flight) {
        if (flight.getSeats() == null || flight.getSeats() <= 0) {
            System.err.println(
                    "Cannot generate seats for flight " + flight.getFlightNumber() + " with no seats defined.");
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
            } else if (currentCol == 'C' || currentCol == 'D') {
                seat.setAisle(true);
            }

            if (currentRow <= 5 && flight.getCabinClass() == CabinClass.BUSINESS) {
                seat.setPricePremium(new BigDecimal("50.00"));
            } else if (currentRow <= 2 && flight.getCabinClass() == CabinClass.FIRST_CLASS) {
                seat.setPricePremium(new BigDecimal("100.00"));
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
