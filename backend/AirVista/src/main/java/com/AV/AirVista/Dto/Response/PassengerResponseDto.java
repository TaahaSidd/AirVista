package com.AV.AirVista.Dto.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PassengerResponseDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
}
