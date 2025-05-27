package com.AV.AirVista.Model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.AV.AirVista.Model.Enums.BookingStatus;
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
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
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
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate bookingDate;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    private BigDecimal totalPrice;

    private String razorPayOrderId;
    private String razorPaymentId;
    private String razorPaymentSignature;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private AppUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "flight_id")
    private Flight flight;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Passenger> passengers;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "booking_seats", joinColumns = @JoinColumn(name = "booking_id"), inverseJoinColumns = @JoinColumn(name = "seat_id"))
    private List<Seat> assignedSeats;
}
