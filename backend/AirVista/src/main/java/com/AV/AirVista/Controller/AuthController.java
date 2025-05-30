package com.AV.AirVista.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.AV.AirVista.Dto.Request.LoginRequest;
import com.AV.AirVista.Dto.Request.RefreshTokenRequest;
import com.AV.AirVista.Dto.Request.UserRegistrationRequestDto;
import com.AV.AirVista.Dto.Response.AuthenticationResponse;
import com.AV.AirVista.Model.AppUser;
import com.AV.AirVista.Repository.UserRepository;
import com.AV.AirVista.Security.JwtUtil;
import com.AV.AirVista.Service.AuthService;
import com.AV.AirVista.Service.BlackListService;
import com.AV.AirVista.Service.RefreshTokenService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/AirVista/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final BlackListService blackListService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepo;
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody UserRegistrationRequestDto req) {
        return ResponseEntity.ok(authService.register(req));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.authenticate(req));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthenticationResponse> refreshToken(@RequestBody RefreshTokenRequest req) {
        return ResponseEntity.ok(authService.refreshToken(req));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer "))
            return new ResponseEntity<>("Missing or invalid Authorization header", HttpStatus.BAD_REQUEST);

        String accessToken = authHeader.substring(7);
        blackListService.blackListedToken(accessToken);

        try {
            String userEmail = jwtUtil.extractUsername(accessToken);
            AppUser currentUser = userRepo.findByEmail(userEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            refreshTokenService.deleteRefreshTokenByUser(currentUser);
            System.out.println("Refresh Token revoked");
        } catch (Exception e) {
            System.err.println("Error revoking token");
            return new ResponseEntity<>("Logged out successfully, but error occurred while revoking refresh token",
                    HttpStatus.OK);
        }

        return new ResponseEntity<>("Logged out successfully", HttpStatus.OK);
    }
}
