package com.AV.AirVista.Service;

import java.util.Optional;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.AV.AirVista.Dto.AuthenticationRequest;
import com.AV.AirVista.Dto.AuthenticationResponse;
import com.AV.AirVista.Dto.RefreshTokenRequest;
import com.AV.AirVista.Dto.RegisterRequest;
import com.AV.AirVista.Model.AppUser;
import com.AV.AirVista.Model.RefreshToken;
import com.AV.AirVista.Repository.UserRepository;
import com.AV.AirVista.Security.JwtUtil;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Transactional
    public AuthenticationResponse register(RegisterRequest req) {
        if (userRepo.findByEmail(req.getEmail()).isPresent())
            throw new IllegalArgumentException("User with this email already exists.");

        var user = AppUser.builder()
                .fname(req.getFname())
                .lname(req.getLname())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(req.getRole())
                .build();

        var savedUser = userRepo.save(user);
        emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getFname());

        var jwtToken = jwtUtil.generateToken(user);
        return AuthenticationResponse.builder().accessToken(jwtToken).build();
    }

    @Transactional
    public AuthenticationResponse authenticate(AuthenticationRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        req.getEmail(),
                        req.getPassword()));

        var user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("USER NOT FOUND"));

        var accessToken = jwtUtil.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .build();
    }

    @Transactional // Ensures database operations (like deleting/creating refresh tokens) are
                   // atomic
    public AuthenticationResponse refreshToken(RefreshTokenRequest request) {
        // 1. Verify the provided refresh token string (checks existence and expiry)
        Optional<RefreshToken> storedRefreshTokenOpt = refreshTokenService
                .verifyRefreshToken(request.getRefreshToken());

        if (storedRefreshTokenOpt.isEmpty()) {
            throw new RuntimeException("Refresh token is invalid or expired!");
        }

        RefreshToken storedRefreshToken = storedRefreshTokenOpt.get();
        AppUser user = storedRefreshToken.getUser();

        // 2. (Optional but Recommended) Implement Refresh Token Rotation:
        refreshTokenService.deleteRefreshToken(storedRefreshToken.getToken());

        // 3. Generate a NEW Access Token for the user
        String newAccessToken = jwtUtil.generateToken(user);

        // 4. Generate and save a NEW Refresh Token for the user
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user);

        // 5. Return the new pair of tokens (access and refresh)
        return AuthenticationResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken.getToken())
                .build();
    }

}
