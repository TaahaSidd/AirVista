package com.AV.AirVista.Dto.AviationStack;

import lombok.Data;

@Data
public class FlightData {
    private String flight_date;
    private String flight_status;
    private DepartureData dept;
    private ArrivalData arrv;

    private AirlineData airline;
    private FlightDetails flight;
}
