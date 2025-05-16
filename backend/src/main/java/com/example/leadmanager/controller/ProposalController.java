package com.example.leadmanager.controller;

import com.example.leadmanager.model.Lead;
import com.example.leadmanager.model.ProposalRequest;
import com.example.leadmanager.model.User;
import com.example.leadmanager.repository.LeadActivityRepository;
import com.example.leadmanager.repository.LeadRepository;
import com.example.leadmanager.repository.ProposalRequestRepository;
import com.example.leadmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

    @RestController
    @RequestMapping("/proposals")
    @RequiredArgsConstructor
    public class ProposalController {


        private final ProposalRequestRepository proposalRequestRepository;
        private final LeadRepository leadRepository;
        private final UserRepository userRepository;
        @Autowired
        private LeadActivityRepository leadActivityRepository;





        @PostMapping("/request/{leadId}")
        public ResponseEntity<?> requestProposal(
                @PathVariable Long leadId,
                @RequestParam(required = false) Long proposalCreatorId,
                @RequestParam(required = false) String notes,
                @RequestParam(required = false) MultipartFile proposalFile,
                Principal principal
        ) {
            try {
                // 🔍 Fetch the requesting user
                User requestingUser = userRepository.findByEmail(principal.getName())
                        .orElseThrow(() -> new RuntimeException("Requesting user not found"));

                // 🔍 Fetch the lead
                Lead lead = leadRepository.findById(leadId)
                        .orElseThrow(() -> new RuntimeException("Lead with ID " + leadId + " not found"));

                // 🔍 If assignedTo is present, fetch the assigned user
                User assignedUser = null;
                if (proposalCreatorId != null) {
                    assignedUser = userRepository.findById(proposalCreatorId)
                            .orElseThrow(() -> new RuntimeException("Assigned user with ID " + proposalCreatorId + " not found"));
                }

                // 📁 Save the uploaded reference file if present
                String referenceFilePath = null;
                if (proposalFile != null && !proposalFile.isEmpty()) {
                    String filename = UUID.randomUUID() + "_" + proposalFile.getOriginalFilename();
                    Path path = Paths.get("uploads/proposals/" + filename);
                    Files.createDirectories(path.getParent());
                    Files.copy(proposalFile.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
                    referenceFilePath = path.toString();
                }

                // 📝 Create and save the proposal request
                ProposalRequest proposal = ProposalRequest.builder()
                        .lead(lead)
                        .requestedBy(requestingUser)
                        .assignedTo(assignedUser)
                        .notes(notes)
                        .referenceFilePath(referenceFilePath)  // ⬅️ now saving as reference file
                        .completed(false)
                        .build();

                proposalRequestRepository.save(proposal);

                return ResponseEntity.ok("✅ Proposal request submitted successfully.");
            } catch (IOException ioEx) {
                ioEx.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("❌ Failed to upload file. Please try again.");
            } catch (RuntimeException ex) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("❌ " + ex.getMessage());
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("❌ An unexpected error occurred. Please contact support.");
            }
        }


        @PostMapping("/upload/{proposalId}")
        public ResponseEntity<?> uploadProposal(
                @PathVariable Long proposalId,
                @RequestParam MultipartFile proposalFile,
                Principal principal
        ) {
            try {
                User currentUser = userRepository.findByEmail(principal.getName())
                        .orElseThrow(() -> new RuntimeException("User not found"));

                ProposalRequest proposal = proposalRequestRepository.findById(proposalId)
                        .orElseThrow(() -> new RuntimeException("Proposal not found"));

                if (!proposal.getAssignedTo().getId().equals(currentUser.getId())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized");
                }

                String filename = UUID.randomUUID() + "_" + proposalFile.getOriginalFilename();
                Path path = Paths.get("uploads/proposals/" + filename);
                Files.createDirectories(path.getParent());
                Files.copy(proposalFile.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

                proposal.setProposalFilePath(path.toString());  // ⬅️ now saving as proposal file
                proposal.setProposalUploadedAt(LocalDateTime.now());

                proposalRequestRepository.save(proposal);

                return ResponseEntity.ok("✅ Proposal uploaded successfully");

            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("❌ Upload failed");
            }
        }

        // 🔹 Mark as complete by requester
    @PostMapping("/complete/{proposalId}")
    public ResponseEntity<?> markProposalComplete(
            @PathVariable Long proposalId,
            Principal principal
    ) {
        try {
            User user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            ProposalRequest proposal = proposalRequestRepository.findById(proposalId)
                    .orElseThrow(() -> new RuntimeException("Proposal not found"));

            if (!proposal.getRequestedBy().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only the requester can mark complete");
            }

            proposal.setCompleted(true);
            proposalRequestRepository.save(proposal);

            return ResponseEntity.ok("Proposal marked as complete");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
        }
    }

        // Proposals sent by current user
        @GetMapping("/sent")
        public ResponseEntity<?> getSentProposals(Principal principal) {
            User user = userRepository.findByEmail(principal.getName()).orElseThrow();
            List<ProposalRequest> sent = proposalRequestRepository.findByRequestedBy(user);
            return ResponseEntity.ok(sent);
        }

        // Proposals assigned to current user
        @GetMapping("/received")
        public ResponseEntity<?> getReceivedProposals(Principal principal) {
            User user = userRepository.findByEmail(principal.getName()).orElseThrow();
            List<ProposalRequest> received = proposalRequestRepository.findByAssignedTo(user);
            return ResponseEntity.ok(received);
        }

    }
