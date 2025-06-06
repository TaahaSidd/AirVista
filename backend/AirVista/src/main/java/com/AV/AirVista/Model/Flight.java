package com.AV.AirVista.Model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import com.AV.AirVista.Model.Enums.CabinClass;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Transient;
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
    private LocalDateTime deptTime;
    private LocalDateTime arrTime;
    private Integer seats;
    private BigDecimal price;
    private Integer stops;
    private String airline;

    @Enumerated(EnumType.STRING)
    private CabinClass cabinClass;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "origin_id")
    private Airport origin;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "destination_id")
    private Airport destination;

    @OneToMany(mappedBy = "flight", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Booking> booking;

    @OneToMany(mappedBy = "flight", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Seat> seatsLayout;

    private String flightStatus;
    private String statusMessage;

    // Departure details
    private LocalDateTime actualDeptTime;
    private String depTerminal;
    private String depGate;
    private Integer depDelay;

    // Arrival details
    private LocalDateTime actualArrTime;
    private String arrTerminal;
    private String arrGate;
    private Integer arrDelay;

    @Transient
    public int getAvailableSeats() {
        if (booking == null) {
            return seats;
        }
        long bookedSeats = booking.stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus()))
                .count();
        return seats - (int) bookedSeats;
    }
}
