package com.AV.AirVista.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.AV.AirVista.Dto.Request.AuthenticationRequest;
import com.AV.AirVista.Dto.Request.RefreshTokenRequest;
import com.AV.AirVista.Dto.Request.RegisterRequest;
import com.AV.AirVista.Dto.Response.AuthenticationResponse;
import com.AV.AirVista.Service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/AirVista/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest req) {
        return ResponseEntity.ok(authService.authenticate(req));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthenticationResponse> refreshToken(@RequestBody RefreshTokenRequest req) {
        return ResponseEntity.ok(authService.refreshToken(req));
    }

}
