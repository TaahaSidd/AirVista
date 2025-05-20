package com.AV.AirVista.Model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String flightNumber;
    // private String destination;
    private LocalDateTime deptTime;
    private LocalDateTime arrTime;
    private Integer seats;
    private double price;

    @ManyToOne
    @JoinColumn(name = "origin_id")
    private Airport origin;

    @ManyToOne
    @JoinColumn(name = "destination_id")
    private Airport destination;

    @OneToMany(mappedBy = "flight")
    private List<Booking> booking;
}
