package com.example.leadmanager.controller;

import com.example.leadmanager.model.User;
import com.example.leadmanager.model.enums.Role;
import com.example.leadmanager.model.enums.Status;
import com.example.leadmanager.repository.UserRepository;
import com.example.leadmanager.service.MailService;
import com.example.leadmanager.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MailService mailService;


    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/register")
    public User createUser(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setName(updatedUser.getName());
            user.setEmail(updatedUser.getEmail());
            user.setRole(updatedUser.getRole());
            return userRepository.save(user);
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }

    @GetMapping("/proposal-creators")
    public ResponseEntity<List<User>> getProposalCreators() {
        List<User> creators = userRepository.findByRole(Role.PROPOSAL_CREATOR);
        return ResponseEntity.ok(creators);
    }

    @PostMapping("/register/mail")
    public String inviteUserByEmail(@RequestBody User user) {
        // Generate unique token
        String token = UUID.randomUUID().toString();

        // Set invite token and mark as not activated
        user.setInviteToken(token);
        user.setActivated(false);
        user.setCreatedAt(LocalDateTime.now());

        // Save user without password for now (they’ll set it via invite link)
        userRepository.save(user);

        // Construct the link they will use to set a new password
        String inviteLink = "http://localhost:5173/set-password?token=" + token;

        // Send invitation email
        mailService.sendInvite(user.getEmail(), inviteLink);

        return "Invitation sent to " + user.getEmail();
    }

    @PostMapping("/auth/validate-invite")
    public ResponseEntity<?> validateInviteToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");

        if (token == null || token.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Token is required"));
        }

        Optional<User> optionalUser = userRepository.findByInviteToken(token);
        if (optionalUser.isPresent() && !optionalUser.get().isActivated()) {
            return ResponseEntity.ok(Map.of("success", true));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("success", false, "message", "Invalid or expired token"));
        }
    }


    @PostMapping("/auth/set-password")
    public ResponseEntity<?> setPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String rawPassword = request.get("password");

        if (token == null || rawPassword == null || token.isBlank() || rawPassword.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Token and password are required"));
        }

        Optional<User> optionalUser = userRepository.findByInviteToken(token);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("success", false, "message", "Invalid token"));
        }

        User user = optionalUser.get();
        if (user.isActivated()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("success", false, "message", "User already activated"));
        }

        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setActivated(true);
        user.setInviteToken(null); // Clear token
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("success", true, "message", "Password set successfully"));
    }

    @PatchMapping("/{id}/disable")
    public ResponseEntity<?> disableUser(@PathVariable Long id) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = optionalUser.get();

        if (user.getStatus() == Status.INACTIVE) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User is already inactive");
        }

        user.setStatus(Status.INACTIVE);
        userRepository.save(user);
        return ResponseEntity.ok("User disabled successfully");
    }

    @PatchMapping("/{id}/reactivate")
    public ResponseEntity<?> reactivateUser(@PathVariable Long id) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = optionalUser.get();

        if (user.getStatus() == Status.ACTIVE) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User is already active");
        }

        user.setStatus(Status.ACTIVE);
        userRepository.save(user);
        return ResponseEntity.ok("User reactivated successfully");
    }

    @Autowired
    private UserService userService;

    @GetMapping("/non-admin-users")
    public List<User> getNonAdminUsers() {
        return userService.getAllUsers()
                .stream()
                .filter(user -> user.getRole() != Role.ADMIN)
                .collect(Collectors.toList());
    }


}
