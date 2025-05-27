package com.AV.AirVista.Dto.Request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PassengerRequestDto {

    @NotBlank(message = "Passenger name is required.")
    private String name;

    @NotBlank(message = "Passenger email is required.")
    @Email(message = "Invalid email format.")
    private String email;

    @NotBlank(message = "Passenger phone number is required.")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits.") // Example pattern for 10-digit phone
    private String phone;
}
