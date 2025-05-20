package com.AV.AirVista.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.AV.AirVista.Dto.UserDto;
import com.AV.AirVista.Model.User;
import com.AV.AirVista.Repository.UserRepo;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Add
    public ResponseEntity<User> addUser(UserDto req) {
        User user = new User();

        String hashPassword = passwordEncoder.encode(req.getPassword());

        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(hashPassword);
        user.setRole(req.getRole());

        return ResponseEntity.ok(userRepo.save(user));
    }

    // Get user by id.
    public User getUserById(Long id) {
        return userRepo.findById(id).orElse(null);
    }

    // Get user by email.
    public User getUerByEmail(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not with email" + email));
    }

    // Update
    public ResponseEntity<User> updateUser(Long id, UserDto req) {
        Optional<User> userOptional = userRepo.findById(id);

        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();
        String hashPassword = passwordEncoder.encode(req.getPassword());

        if (req.getName() != null)
            user.setName(req.getName());
        if (req.getEmail() != null)
            user.setEmail(req.getEmail());
        if (req.getPassword() != null)
            user.setPassword(hashPassword);
        if (req.getRole() != null)
            user.setRole(req.getRole());

        User saved = userRepo.save(user);
        return ResponseEntity.ok(saved);

    }

    // Delete
    public ResponseEntity<String> deleteUser(Long id) {
        Optional<User> optUser = userRepo.findById(id);

        if (optUser.isEmpty())
            return ResponseEntity.notFound().build();

        userRepo.deleteById(id);
        return ResponseEntity.ok("User deleted with id" + id);
    }

    // All users
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }
}
