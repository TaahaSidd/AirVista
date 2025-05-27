package com.AV.AirVista.Dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AirportDto {

    private Long id;

    @NotBlank(message = "Airport name cannot be blank")
    private String name;

    @NotBlank(message = "Airport code cannot be blank")
    private String code;

    @NotBlank(message = "City cannot be blank")
    private String city;

    @NotBlank(message = "Country cannot be blank")
    private String country;
}
