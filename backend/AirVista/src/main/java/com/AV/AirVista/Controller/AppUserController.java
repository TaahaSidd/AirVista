package com.AV.AirVista.Controller;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
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
import com.AV.AirVista.Model.UserProfileRequest;
import com.AV.AirVista.Model.UserProfileResponse;
import com.AV.AirVista.Service.AppUserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("AirVista/Users")
@RequiredArgsConstructor
public class AppUserController {

    @Autowired
    private AppUserService userService;

    @PostMapping("/add")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<AppUser> addUser(@Valid @RequestBody AppUserDto req) {
        return userService.addUser(req);
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileResponse> getMyProfile(Authentication authentication) {
        String userEmail = authentication.getName();
        AppUser user = userService.getUserByEmail(userEmail);

        UserProfileResponse response = UserProfileResponse.builder()
                .id(user.getId())
                .firstname(user.getFname())
                .lastname(user.getLname())
                .email(user.getEmail())
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or (isAuthenticated() and @appUserService.getUserProfileById(#id).getEmail() == authentication.name)")
    public ResponseEntity<UserProfileResponse> getUserById(@PathVariable Long id, Authentication authentication) {
        AppUser user = userService.getUserById(id);

        if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            if (!Objects.equals(user.getEmail(), authentication.getName())) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
        }

        UserProfileResponse response = UserProfileResponse.builder()
                .id(user.getId())
                .firstname(user.getFname())
                .lastname(user.getLname())
                .email(user.getEmail())
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or (isAuthenticated() and #email == authentication.name)")
    public ResponseEntity<UserProfileResponse> getUserByEmail(@Valid @PathVariable String email,
            Authentication authentication) {
        AppUser user = userService.getUserByEmail(email);

        if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            if (!Objects.equals(user.getEmail(), authentication.getName())) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
        }

        UserProfileResponse response = UserProfileResponse.builder()
                .id(user.getId())
                .firstname(user.getFname())
                .lastname(user.getLname())
                .email(user.getEmail())
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or (isAuthenticated() and @appUserService.getUserById(#id).getEmail() == authentication.name)")
    public ResponseEntity<UserProfileResponse> updateUser(@PathVariable Long id,
            @Valid @RequestBody UserProfileRequest request,
            Authentication authentication) {
        if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            AppUser targetUser = userService.getUserById(id);
            if (!Objects.equals(targetUser.getEmail(), authentication.getName())) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
        }

        AppUser updatedUser = userService.updateUser(id, request);

        UserProfileResponse response = UserProfileResponse.builder()
                .id(updatedUser.getId())
                .firstname(updatedUser.getFname())
                .lastname(updatedUser.getLname())
                .email(updatedUser.getEmail())
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<UserProfileResponse>> getAllUser() {
        List<AppUser> users = userService.getAllUsers(); // Assuming this method exists and returns List<AppUser>

        List<UserProfileResponse> userDtos = users.stream()
                .map(user -> UserProfileResponse.builder()
                        .id(user.getId())
                        .firstname(user.getFname())
                        .lastname(user.getLname())
                        .email(user.getEmail())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(userDtos);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        return userService.deleteUser(id);
    }

}
