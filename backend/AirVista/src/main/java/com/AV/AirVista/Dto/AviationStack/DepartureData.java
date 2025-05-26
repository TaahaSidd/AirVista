package com.AV.AirVista.Dto.AviationStack;

import lombok.Data;

@Data
public class DepartureData {
    private String airport;
    private String timezone;
    private String iata;
    private String icao;
    private String terminal;
    private String gate;
    private String baggage;
    private Integer delay;
    private String scheduled;
    private String estimated;
    private String actual;
    private String actual_runway;
}
