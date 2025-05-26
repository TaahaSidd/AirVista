package com.AV.AirVista.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.AV.AirVista.Dto.AviationStack.FlightData;
import com.AV.AirVista.Dto.AviationStack.FlightResponse;
import com.AV.AirVista.Model.Flight;
import com.AV.AirVista.Repository.FlightRepo;
import com.AV.AirVista.Security.AviationStackConfig;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AviationStackService {

    private final RestTemplate restTemplate;
    private final AviationStackConfig avStackConfig;
    private final FlightRepo flightRepo;

    private static final DateTimeFormatter AVIATIONSTACK_DATE_TIME_FORMATTER = DateTimeFormatter.ISO_OFFSET_DATE_TIME;

    public Optional<FlightData> getFlightStatus(String flightNumber, String flightDate) {
        String apiUrl = UriComponentsBuilder.fromHttpUrl(avStackConfig.getBaseUrl())
                .path("/flights")
                .queryParam("access_key", avStackConfig.getAccessKey())
                .queryParam("flight_number", flightNumber)
                .queryParam("flight_date", flightDate) // Assuming YYYY-MM-DD format for flight_date
                .toUriString();

        try {
            // Make the HTTP GET request
            FlightResponse response = restTemplate.getForObject(apiUrl, FlightResponse.class);

            // AviationStack returns a list of flights in 'data' field.
            // For a specific flight number and date, we expect usually one or zero.
            if (response != null && response.getData() != null && !response.getData().isEmpty()) {
                // You might need to filter further if API returns multiple entries for same
                // flight_number
                // For simplicity, taking the first one.
                return Optional.of(response.getData().get(0));
            }
        } catch (Exception e) {
            // Log the error for debugging
            System.err.println("Error fetching flight status from AviationStack: " + e.getMessage());
            // In a real application, you'd use a proper logging framework (e.g., SLF4J with
            // Logback)
        }
        return Optional.empty();
    }

    /**
     * Fetches real-time flight status and updates the corresponding Flight entity
     * in your database.
     * 
     * @param flightId The ID of your internal Flight entity.
     * @return The updated Flight entity or an empty Optional if not found or status
     *         not updated.
     */
    public Optional<Flight> updateFlightStatus(Long flightId) {
        Optional<Flight> flightOptional = flightRepo.findById(flightId);

        if (flightOptional.isEmpty()) {
            return Optional.empty();
        }

        Flight flight = flightOptional.get();

        // Ensure flightNumber is clean (no spaces etc. if AviationStack expects
        // specific format)
        String cleanedFlightNumber = flight.getFlightNumber().replace(" ", "");
        String flightDate = flight.getDeptTime().toLocalDate().toString(); // Get date part for API call

        Optional<FlightData> flightDataOptional = getFlightStatus(cleanedFlightNumber, flightDate);

        if (flightDataOptional.isPresent()) {
            FlightData data = flightDataOptional.get();

            // Map AviationStack data to your Flight entity fields
            flight.setFlightStatus(data.getFlight_status());
            // No status message field directly in FlightData, you could derive it or leave
            // null
            // flight.setStatusMessage(data.getStatusMessage());

            // Departure details
            if (data.getDept() != null) {
                flight.setDepTerminal(data.getDept().getTerminal());
                flight.setDepGate(data.getDept().getGate());
                flight.setDepDelay(data.getDept().getDelay());
                // Parse actual departure time if available
                if (data.getDept().getActual() != null) {
                    try {
                        flight.setActualDeptTime(LocalDateTime.parse(data.getDept().getActual(),
                                AVIATIONSTACK_DATE_TIME_FORMATTER));
                    } catch (DateTimeParseException e) {
                        System.err.println("Failed to parse actual departure time: " + data.getDept().getActual());
                    }
                } else if (data.getDept().getEstimated() != null) { // Fallback to estimated
                    try {
                        flight.setActualDeptTime(LocalDateTime.parse(data.getDept().getEstimated(),
                                AVIATIONSTACK_DATE_TIME_FORMATTER));
                    } catch (DateTimeParseException e) {
                        System.err.println(
                                "Failed to parse estimated departure time: " + data.getDept().getEstimated());
                    }
                }
            }

            // Arrival details
            if (data.getArrv() != null) {
                flight.setArrTerminal(data.getArrv().getTerminal());
                flight.setArrGate(data.getArrv().getGate());
                flight.setArrDelay(data.getArrv().getDelay());
                // Parse actual arrival time if available
                if (data.getArrv().getActual() != null) {
                    try {
                        flight.setActualArrTime(
                                LocalDateTime.parse(data.getArrv().getActual(), AVIATIONSTACK_DATE_TIME_FORMATTER));
                    } catch (DateTimeParseException e) {
                        System.err.println("Failed to parse actual arrival time: " + data.getArrv().getActual());
                    }
                } else if (data.getArrv().getEstimated() != null) { // Fallback to estimated
                    try {
                        flight.setActualArrTime(LocalDateTime.parse(data.getArrv().getEstimated(),
                                AVIATIONSTACK_DATE_TIME_FORMATTER));
                    } catch (DateTimeParseException e) {
                        System.err
                                .println("Failed to parse estimated arrival time: " + data.getArrv().getEstimated());
                    }
                }
            }

            // Save the updated Flight entity to database
            return Optional.of(flightRepo.save(flight));
        }

        return Optional.empty(); // No status data found for this flight
    }
}
