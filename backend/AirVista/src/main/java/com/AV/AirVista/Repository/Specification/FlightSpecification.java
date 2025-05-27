package com.AV.AirVista.Repository.Specification;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.data.jpa.domain.Specification;

import com.AV.AirVista.Model.Airport;
import com.AV.AirVista.Model.Enums.CabinClass;
import com.AV.AirVista.Model.Flight;

import jakarta.persistence.criteria.Join;

public class FlightSpecification {
    // Specification for filtering by origin city
    public static Specification<Flight> hasOriginCity(String originCity) {
        return (root, query, criteriaBuilder) -> {
            if (originCity == null || originCity.isEmpty()) {
                return null;
            }
            // Join to the 'origin' Airport entity (if 'origin' is a @ManyToOne
            // relationship)
            Join<Flight, Airport> originJoin = root.join("origin");
            // Use LOWER() for case-insensitivity and LIKE for partial match
            return criteriaBuilder.like(
                    criteriaBuilder.lower(originJoin.get("city")), // Convert stored city name to lowercase
                    "%" + originCity.toLowerCase() + "%" // Convert search query to lowercase and add wildcards
            );
        };
    }

    // Specification for filtering by destination city
    public static Specification<Flight> hasDestinationCity(String destinationCity) {
        return (root, query, criteriaBuilder) -> {
            if (destinationCity == null || destinationCity.isEmpty()) {
                return null;
            }
            // Join to the 'destination' Airport entity (if 'destination' is a @ManyToOne
            // relationship)
            Join<Flight, Airport> destinationJoin = root.join("destination");
            // Use LOWER() for case-insensitivity and LIKE for partial match
            return criteriaBuilder.like(
                    criteriaBuilder.lower(destinationJoin.get("city")), // Convert stored city name to lowercase
                    "%" + destinationCity.toLowerCase() + "%" // Convert search query to lowercase and add wildcards
            );
        };
    }

    // Specification for filtering by exact departure date
    public static Specification<Flight> hasDepartureDate(LocalDate departureDate) {
        return (root, query, criteriaBuilder) -> {
            if (departureDate == null) {
                return null;
            }
            // Compare only the date part of LocalDateTime
            return criteriaBuilder.equal(criteriaBuilder.function("DATE", LocalDate.class, root.get("deptTime")),
                    departureDate);
        };
    }

    // Specification for filtering by airline
    public static Specification<Flight> hasAirline(String airline) {
        return (root, query, criteriaBuilder) -> {
            if (airline == null || airline.isEmpty()) {
                return null;
            }
            return criteriaBuilder.equal(root.get("airline"), airline);
        };
    }

    // Specification for filtering by minimum stops
    public static Specification<Flight> hasMinStops(Integer minStops) {
        return (root, query, criteriaBuilder) -> {
            if (minStops == null) {
                return null;
            }
            return criteriaBuilder.greaterThanOrEqualTo(root.get("stops"), minStops);
        };
    }

    // Specification for filtering by maximum stops
    public static Specification<Flight> hasMaxStops(Integer maxStops) {
        return (root, query, criteriaBuilder) -> {
            if (maxStops == null) {
                return null;
            }
            return criteriaBuilder.lessThanOrEqualTo(root.get("stops"), maxStops);
        };
    }

    // Specification for filtering by direct flights (0 stops)
    public static Specification<Flight> isDirectFlight() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("stops"), 0);
    }

    // Specification for filtering by minimum price
    public static Specification<Flight> hasMinPrice(BigDecimal minPrice) {
        return (root, query, criteriaBuilder) -> {
            if (minPrice == null) {
                return null;
            }
            return criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice);
        };
    }

    // Specification for filtering by maximum price
    public static Specification<Flight> hasMaxPrice(BigDecimal maxPrice) {
        return (root, query, criteriaBuilder) -> {
            if (maxPrice == null) {
                return null;
            }
            return criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice);
        };
    }

    // Specification for filtering by cabin class
    public static Specification<Flight> hasCabinClass(CabinClass cabinClass) {
        return (root, query, criteriaBuilder) -> {
            if (cabinClass == null) {
                return null;
            }
            return criteriaBuilder.equal(root.get("cabinClass"), cabinClass);
        };
    }

    // Specification for filtering by minimum departure time (hour, minute)
    public static Specification<Flight> hasMinDepartureTime(LocalTime minTime) {
        return (root, query, criteriaBuilder) -> {
            if (minTime == null) {
                return null;
            }
            return criteriaBuilder.greaterThanOrEqualTo(
                    criteriaBuilder.function("TIME", LocalTime.class, root.get("deptTime")), minTime);
        };
    }

    // Specification for filtering by maximum departure time (hour, minute)
    public static Specification<Flight> hasMaxDepartureTime(LocalTime maxTime) {
        return (root, query, criteriaBuilder) -> {
            if (maxTime == null) {
                return null;
            }
            return criteriaBuilder.lessThanOrEqualTo(
                    criteriaBuilder.function("TIME", LocalTime.class, root.get("deptTime")), maxTime);
        };
    }

    // Specification to check if there are enough available seats
    public static Specification<Flight> hasAvailableSeats(Integer requestedPassengers) {
        return (root, query, criteriaBuilder) -> {
            if (requestedPassengers == null || requestedPassengers <= 0) {
                return null;
            }
            return criteriaBuilder.greaterThanOrEqualTo(root.get("seats"), requestedPassengers);
        };
    }
}
