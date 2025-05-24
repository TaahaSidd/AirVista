package com.AV.AirVista.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.AV.AirVista.Dto.AppUserDto;
import com.AV.AirVista.Model.AppUser;
import com.AV.AirVista.Repository.AppUserRepo;

@Service
public class AppUserService {

    @Autowired
    private AppUserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Add
    public ResponseEntity<AppUser> addUser(AppUserDto req) {

        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        AppUser user = new AppUser();

        String hashPassword = passwordEncoder.encode(req.getPassword());

        user.setFname(req.getFname());
        user.setEmail(req.getEmail());
        user.setPassword(hashPassword);
        user.setRole(req.getRole());

        return ResponseEntity.ok(userRepo.save(user));
    }

    // Get user by id.
    public Optional<AppUser> getUserById(Long id) {
        return userRepo.findById(id);
    }

    // Get user by email.
    public AppUser getUserByEmail(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not with email  " + email));
    }

    // Update
    public ResponseEntity<AppUser> updateUser(Long id, AppUserDto req) {
        Optional<AppUser> userOptional = userRepo.findById(id);

        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        AppUser user = userOptional.get();
        if (req.getEmail() != null && !req.getEmail().equals(user.getEmail())) {
            if (userRepo.findByEmail(req.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            }
        }
        if (req.getFname() != null)
            user.setFname(req.getFname());
        if (req.getLname() != null)
            user.setLname(req.getLname());
        if (req.getEmail() != null)
            user.setEmail(req.getEmail());
        if (req.getPassword() != null && !req.getPassword().isEmpty()) {
            String hashPassword = passwordEncoder.encode(req.getPassword());
            user.setPassword(hashPassword);
        }
        if (req.getRole() != null)
            user.setRole(req.getRole());

        AppUser saved = userRepo.save(user);
        return ResponseEntity.ok(saved);

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
}
