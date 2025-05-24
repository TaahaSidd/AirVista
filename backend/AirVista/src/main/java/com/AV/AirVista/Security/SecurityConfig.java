package com.AV.AirVista.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.AV.AirVista.Service.CustomUserDetailsService;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    private final CustomUserDetailsService customUserDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth

                        // Logout.
                        .requestMatchers(HttpMethod.POST, "/AirVista/v1/auth/logout").authenticated()

                        // Public authentication Endpoints.
                        .requestMatchers("/AirVista/v1/auth/**").permitAll()

                        // Specific GET requests.
                        // Require Valid authenticated user.
                        .requestMatchers(HttpMethod.GET, "AirVista/Booking/my-bookings").authenticated()
                        .requestMatchers(HttpMethod.GET, "AirVista/Booking/{id}/my-booking").authenticated()

                        // Public GET request.
                        .requestMatchers(HttpMethod.GET, "/AirVista/Flight/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/AirVist/Booking/***").permitAll()
                        .requestMatchers(HttpMethod.GET, "/AirVista/Airport/**").permitAll()

                        .requestMatchers(HttpMethod.POST, "/AirVista/Booking")
                        .hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")

                        // ADMIN access only.
                        // Flight.
                        .requestMatchers(HttpMethod.POST, "/AirVista/Flight/**").hasAnyAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/AirVista/Flight/**").hasAnyAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/AirVista/Flight/**").hasAnyAuthority("ROLE_ADMIN")

                        // Booking.
                        .requestMatchers(HttpMethod.POST, "/AirVista/Booking/**").hasAnyAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/AirVista/Booking/**").hasAnyAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/AirVista/Booking/**").hasAnyAuthority("ROLE_ADMIN")

                        // Airport.
                        .requestMatchers(HttpMethod.POST, "/AirVista/Airport/**").hasAnyAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/AirVista/Airport/**").hasAnyAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/AirVista/Airport/**").hasAnyAuthority("ROLE_ADMIN")

                        .anyRequest().authenticated())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
