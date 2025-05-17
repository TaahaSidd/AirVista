package com.AV.AirVista.Model;

import java.time.LocalTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Flight")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Flight {
    @Id
    private Long id;

    private String flighnumber;
    private String origin;
    private String destination;
    private LocalTime deptTime;
    private LocalTime arrTime;
    private int seats;
    private double price;
}
