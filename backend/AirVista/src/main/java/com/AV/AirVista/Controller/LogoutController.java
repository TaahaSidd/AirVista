package com.AV.AirVista.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.AV.AirVista.Service.BlackListService;
import com.AV.AirVista.Service.RefreshTokenService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;

import com.AV.AirVista.Model.AppUser;
import com.AV.AirVista.Repository.UserRepository;
import com.AV.AirVista.Security.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/AirVista/v1/auth")
@RequiredArgsConstructor
public class LogoutController {

    private final BlackListService blackListService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepo;
    private final RefreshTokenService refreshTokenService;

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
