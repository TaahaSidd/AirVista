package com.AV.AirVista.Dto.AviationStack;

import java.util.List;

import lombok.Data;

@Data
public class FlightResponse {
    private List<FlightData> data;
}
