package com.AV.AirVista.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.AV.AirVista.Model.AppUser;
import com.AV.AirVista.Model.RefreshToken;

public interface RefreshTokenRepo extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    Optional<RefreshToken> findByUser(AppUser user);

    void deleteByUser(AppUser user);

    void deleteByToken(String token);
}
