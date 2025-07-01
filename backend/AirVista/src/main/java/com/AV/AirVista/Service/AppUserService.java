package com.AV.AirVista.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.AV.AirVista.Dto.AppUserDto;
import com.AV.AirVista.Dto.Request.UserCreationByAdminRequestDto;
import com.AV.AirVista.Dto.Request.UserProfileRequest;
import com.AV.AirVista.Model.AppUser;
import com.AV.AirVista.Repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppUserService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    // Add
    public ResponseEntity<AppUser> addUser(AppUserDto req) {

        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        AppUser user = new AppUser();

        user.setFname(req.getFname());
        user.setLname(req.getLname());
        user.setEmail(req.getEmail());
        user.setPassword(req.getPassword());
        user.setRole(req.getRole());

        return ResponseEntity.ok(userRepo.save(user));
    }

    // Get user by id.
    public AppUser getUserById(Long id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    // Get user by email.
    public AppUser getUserByEmail(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not with email  " + email));
    }

    // Update
    @Transactional
    public AppUser updateUser(Long id, UserProfileRequest req) {
        AppUser user = userRepo.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (req.getFirstname() != null && !req.getFirstname().isBlank())
            user.setFname(req.getFirstname());
        if (req.getLastname() != null && !req.getLastname().isBlank())
            user.setLname(req.getLastname());

        if (req.getEmail() != null && !req.getEmail().isBlank())
            if (user.getEmail().equalsIgnoreCase(req.getEmail()))
                if (userRepo.findByEmail(req.getEmail()).isPresent())
                    throw new IllegalArgumentException("Email " + req.getEmail() + " is already taken by another user");

        user.setEmail(req.getEmail());

        return userRepo.save(user);
    }

    // Delete
    public ResponseEntity<String> deleteUser(Long id) {
        Optional<AppUser> optUser = userRepo.findById(id);

        if (optUser.isEmpty())
            return ResponseEntity.notFound().build();

        userRepo.deleteById(id);
        return ResponseEntity.ok("User deleted with id  " + id);
    }

    // All users
    public List<AppUser> getAllUsers() {
        return userRepo.findAll();
    }

    public AppUserDto toDto(AppUser user) {
        return AppUserDto.builder()
                .id(user.getId())
                .fname(user.getFname())
                .lname(user.getLname())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    @Transactional
    public AppUser createAdminUser(UserCreationByAdminRequestDto req) {
        Optional<AppUser> existingUser = userRepo.findByEmail(req.getEmail());
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("User with this email already exists.");
        }

        var user = AppUser.builder()
                .fname(req.getFname())
                .lname(req.getLname())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .role("ADMIN")
                .build();

        return userRepo.save(user);
    }
}
