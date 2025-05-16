package com.example.leadmanager.controller;

import com.example.leadmanager.model.User;
import com.example.leadmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;
    private final Path uploadDir = Paths.get("uploads/profile_pictures");

    @GetMapping
    public ResponseEntity<?> getProfile(Principal principal) {
        Optional<User> user = userRepository.findByEmail(principal.getName());
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody User updatedUser, Principal principal) {
        Optional<User> userOptional = userRepository.findByEmail(principal.getName());

        if (userOptional.isEmpty()) return ResponseEntity.notFound().build();

        User user = userOptional.get();

        user.setName(updatedUser.getName());
        user.setPhoneNumber(updatedUser.getPhoneNumber());
        user.setBio(updatedUser.getBio());
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/upload-picture")
    public ResponseEntity<?> uploadProfilePicture(@RequestParam("file") MultipartFile file, Principal principal) {
        Optional<User> userOptional = userRepository.findByEmail(principal.getName());

        if (userOptional.isEmpty()) return ResponseEntity.notFound().build();

        User user = userOptional.get();

        try {
            // Create directory if it doesn't exist
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            // Delete old profile picture if it exists
            if (user.getProfilePicture() != null) {
                try {
                    Path oldFilePath = uploadDir.resolve(user.getProfilePicture());
                    if (Files.exists(oldFilePath)) {
                        Files.delete(oldFilePath); // Attempt to delete old file
                        System.out.println("Old profile picture deleted: " + oldFilePath);
                    }
                } catch (Exception ex) {
                    // Log the failure to delete the old file
                    System.err.println("Failed to delete old profile picture: " + ex.getMessage());
                    // Continue without interrupting the new upload
                }
            }

            // Ensure the file is of acceptable type (optional)
            if (!file.getContentType().startsWith("image/")) {
                return ResponseEntity.badRequest().body("Only image files are allowed.");
            }

            // Generate a new filename to avoid conflicts
            String filename = user.getId() + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = uploadDir.resolve(filename);

            // Copy the new file to the target directory
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Update the user's profile picture filename in the database
            user.setProfilePicture(filename);
            userRepository.save(user);

            return ResponseEntity.ok("Profile picture uploaded successfully");

        } catch (Exception e) {
            // Log the error and return a failure message
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to upload image: " + e.getMessage());
        }
    }

}
