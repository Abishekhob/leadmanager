package com.example.leadmanager.controller;

import com.example.leadmanager.dto.LoginRequest;
import com.example.leadmanager.dto.LoginResponse;
import com.example.leadmanager.model.User;
import com.example.leadmanager.repository.UserRepository;
import com.example.leadmanager.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("🔐 Login attempt: " + loginRequest.getEmail());

            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("❌ User not found"));

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            String token = jwtUtil.generateToken(user);
            System.out.println("✅ Login successful: token generated");

            return ResponseEntity.ok(new LoginResponse(token, user.getRole().name(), user.getId()));

        } catch (BadCredentialsException e) {
            System.out.println("❌ Invalid credentials");
            return ResponseEntity.status(401).body("Invalid credentials");
        } catch (Exception e) {
            e.printStackTrace();  // show full error in logs
            return ResponseEntity.status(403).body("Authentication failed");
        }
    }

}
