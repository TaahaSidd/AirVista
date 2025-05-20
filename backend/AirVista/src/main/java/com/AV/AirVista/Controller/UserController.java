package com.AV.AirVista.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.AV.AirVista.Dto.UserDto;
import com.AV.AirVista.Model.User;
import com.AV.AirVista.Service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/AirVista")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/add")
    public ResponseEntity<User> addUser(@Valid @RequestBody UserDto req) {
        return userService.addUser(req);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@Valid @RequestParam Long id) {
        User user = userService.getUserById(id);
        if (user == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(user);
    }

    @GetMapping("{email}")
    public ResponseEntity<User> getUserByEmail(@Valid @RequestParam String email) {
        User user = userService.getUerByEmail(email);

        if (user == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@Valid @PathVariable Long id, @RequestBody UserDto req) {
        return userService.updateUser(id, req);
    }

    @GetMapping
    public List<User> getAllUser() {
        return userService.getAllUsers();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@Valid @PathVariable Long id) {
        return userService.deleteUser(id);
    }

}
