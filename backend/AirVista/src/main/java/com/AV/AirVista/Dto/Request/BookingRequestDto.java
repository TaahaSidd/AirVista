package com.AV.AirVista.Dto.Request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequestDto {

    @NotNull(message = "User ID is required to create a booking.")
    private Long userId;

    @NotNull(message = "Flight ID is required for the booking.")
    private Long flightId;

    @NotNull(message = "At least one passenger is required.")
    @Size(min = 1, message = "You must provide details for at least one passenger.")
    @Valid
    private List<PassengerRequestDto> passengers;

    @Size(min = 1, message = "At least one seat must be selected.")
    private List<String> selectedSeatNumbers;

}