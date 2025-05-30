package com.AV.AirVista.InitialAdminCreator;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.AV.AirVista.Model.AppUser;
import com.AV.AirVista.Repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class InitialAdminCreator {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner createInitialAdmin() {
        return args -> {
            // Check if an admin user already exists
            if (userRepository.findByEmail("admin@example.com").isEmpty()) {
                System.out.println("Creating ADMIN ");
                AppUser adminUser = AppUser.builder()
                        .fname("System")
                        .lname("Admin")
                        .email("admin@example.com")
                        .password(passwordEncoder.encode("ADMINPASSWORD")) // Choose a strong password!
                        .role("ADMIN")
                        .build();
                userRepository.save(adminUser);
                System.out.println("Initial ADMIN user created: admin@example.com");
            } else {
                System.out.println("Initial ADMIN user already exists.");
            }
        };
    }
}
