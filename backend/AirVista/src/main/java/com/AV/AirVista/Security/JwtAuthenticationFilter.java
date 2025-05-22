package com.AV.AirVista.Security;

import java.io.IOException;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component // Make it a Spring-managed component
@RequiredArgsConstructor // Lombok to auto-inject final fields via constructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil; // To validate and extract info from JWTs
    private final UserDetailsService userDetailsService; // To load user details from your database

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization"); // Get the Authorization header
        final String jwt;
        final String userEmail; // Our username will be the user's email

        // 1. Check if the Authorization header is present and starts with "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response); // If not, just pass the request to the next filter
            return;
        }

        // 2. Extract the JWT token
        jwt = authHeader.substring(7); // "Bearer " is 7 characters long

        // 3. Extract the username (email) from the JWT
        userEmail = jwtUtil.extractUsername(jwt);

        // 4. If username is found and user is not already authenticated
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Load user details from the database using the extracted username
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // 5. Validate the token against the user details
            if (jwtUtil.isTokenValid(jwt, userDetails)) {
                // If token is valid, create an Authentication object
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null, // Credentials are null as we've already authenticated via token
                        userDetails.getAuthorities() // Get authorities (roles) from UserDetails
                );
                // Set additional details about the authentication request (e.g., remote
                // address)
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request));
                // Set the Authentication object in Spring Security's SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        // 6. Pass the request to the next filter in the chain (or the controller if
        // this is the last)
        filterChain.doFilter(request, response);
    }
}
