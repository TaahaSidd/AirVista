package com.AV.AirVista.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Airport")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Airport {

    @Id
    private Long id;

    private String name;
    private String code;
    private String city;
    private String country;

}
