package com.AV.AirVista.Model;

import java.math.BigDecimal;

import com.AV.AirVista.Model.Enums.SeatStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn
    @JsonIgnore
    private Flight flight;

    private String seatNumber;
    private String seatRow;
    private String seatColumn;

    @Enumerated
    private SeatStatus status;

    private BigDecimal pricePremium; // Additional cost for this seat.

    private boolean isWindow;
    private boolean isAisle;
    private boolean isExitRow;
}
