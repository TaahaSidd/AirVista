package com.AV.AirVista.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.AV.AirVista.Model.User;

public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
