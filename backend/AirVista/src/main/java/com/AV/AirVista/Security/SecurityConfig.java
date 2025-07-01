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
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

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
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize -> authorize
                        // 1. Logout Endpoint (requires authentication, must be before general auth
                        // permitAll)
                        .requestMatchers(HttpMethod.POST, "/AirVista/v1/auth/logout").authenticated()

                        // 2. Public Authentication Endpoints (register, authenticate, refresh-token)
                        .requestMatchers("/AirVista/v1/auth/**").permitAll()

                        // 3. User Profile Management Endpoints (specific rules for ADMIN, general for
                        // authenticated)
                        // ADMIN-only for adding, getting all, and deleting users
                        .requestMatchers(HttpMethod.POST, "/AirVista/Users/add").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/AirVista/Users").hasAuthority("ROLE_ADMIN") // For getAllUser
                        .requestMatchers(HttpMethod.DELETE, "/AirVista/Users/{id}").hasAuthority("ROLE_ADMIN")
                        // All other /AirVista/Users paths require authentication (e.g., /me, /{id},
                        // /email/{email})
                        // Granular authorization (e.g., user can only see their own profile) is handled
                        // by @PreAuthorize
                        .requestMatchers("/AirVista/Users/**").authenticated()

                        // 4. Specific Protected GET Requests (e.g., My Bookings - require authenticated
                        // user)
                        .requestMatchers(HttpMethod.GET, "/AirVista/Booking/my-bookings").authenticated()
                        .requestMatchers(HttpMethod.GET, "/AirVista/Booking/{id}/my-booking").authenticated()

                        // 5. User/Admin POST for creating a Booking (specific endpoint, before general
                        // Booking POST)
                        .requestMatchers(HttpMethod.POST, "/AirVista/Booking/initiate")
                        .hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")

                        // 6. Public GET Requests for all main resources (browsing)
                        .requestMatchers(HttpMethod.GET, "/AirVista/Flight/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/AirVista/Booking/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/AirVista/Airport/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/AirVista/Passenger/**").permitAll()

                        // 7. ADMIN-only access for modifying main resources (POST, PUT, DELETE)
                        // Flight
                        .requestMatchers(HttpMethod.POST, "/AirVista/Flight/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/AirVista/Flight/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/AirVista/Flight/**").hasAuthority("ROLE_ADMIN")

                        // Booking
                        .requestMatchers(HttpMethod.POST, "/AirVista/Booking/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/AirVista/Booking/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/AirVista/Booking/**").hasAuthority("ROLE_ADMIN")

                        // Airport
                        .requestMatchers(HttpMethod.POST, "/AirVista/Airport/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/AirVista/Airport/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/AirVista/Airport/**").hasAuthority("ROLE_ADMIN")

                        // Passenger
                        .requestMatchers(HttpMethod.POST, "/AirVista/Passenger/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/AirVista/Passenger/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/AirVista/Passenger/**").hasAuthority("ROLE_ADMIN")

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

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("http://localhost:3030")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
