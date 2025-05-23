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
import org.springframework.web.bind.annotation.RestController;

import com.AV.AirVista.Dto.AppUserDto;
import com.AV.AirVista.Model.AppUser;
import com.AV.AirVista.Service.AppUserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("AirVista/Users")
public class AppUserController {

    @Autowired
    private AppUserService userService;

    @PostMapping("/add")
    public ResponseEntity<AppUser> addUser(@Valid @RequestBody AppUserDto req) {
        return userService.addUser(req);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<AppUser> getUserById(@Valid @PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<AppUser> getUserByEmail(@Valid @PathVariable String email) {
        AppUser user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppUser> updateUser(@Valid @PathVariable Long id, @RequestBody AppUserDto req) {
        return userService.updateUser(id, req);
    }

    @GetMapping
    public ResponseEntity<List<AppUserDto>> getAllUser() {
        List<AppUser> users = userService.getAllUsers();

        List<AppUserDto> userDtos = users.stream()
                .map(userService::toDto)
                .toList();

        return ResponseEntity.ok(userDtos);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@Valid @PathVariable Long id) {
        return userService.deleteUser(id);
    }

}
