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

    @NotBlank(message = "Airport name cannot be null")
    private String name;

    @NotBlank(message = "Airport code cannot be null")
    private String code;
    private String city;
    private String country;
}
