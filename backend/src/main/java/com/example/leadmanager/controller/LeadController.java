package com.example.leadmanager.controller;

import com.example.leadmanager.dto.LeadRequest;
import com.example.leadmanager.model.*;
import com.example.leadmanager.model.enums.LeadCategory;
import com.example.leadmanager.model.enums.LeadOutcome;
import com.example.leadmanager.model.enums.LeadStatus;
import com.example.leadmanager.model.enums.Role;
import com.example.leadmanager.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/leads")
public class LeadController {

    @Autowired
    private LeadRepository leadRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LeadActivityRepository leadActivityRepository;

    @Autowired
    private FollowUpRepository followUpRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private ProposalRequestRepository proposalRequestRepository;

    @Autowired
    private ReminderRepository reminderRepository;


    @GetMapping
    public List<Lead> getAllLeads() {
        return leadRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Lead>> getLeadsByUser(
            @PathVariable Long userId,
            @RequestParam(required = false) String search) {

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.ok(Collections.emptyList()); // Return empty list if user not found
        }

        List<Lead> leads;

        if (search != null && !search.trim().isEmpty()) {
            String keyword = "%" + search.trim().toLowerCase() + "%";
            leads = leadRepository.findByAssignedToAndKeyword(user, keyword);
        } else {
            leads = leadRepository.findByAssignedTo(user);
        }

        // Optional: sort by createdAt descending if not already handled in the repository
        leads.sort(Comparator.comparing(Lead::getCreatedAt).reversed());

        return ResponseEntity.ok(leads);
    }



    @PostMapping("/create")
    public ResponseEntity<?> createLead(@RequestBody LeadRequest dto) {
        Lead.LeadBuilder leadBuilder = Lead.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .source(dto.getSource())
                .notes(dto.getNotes())
                .status(dto.getStatus() != null ? dto.getStatus() : LeadStatus.NEW); // default if null

        // If assignedTo is present, fetch the user
        User user = null;
        if (dto.getAssignedTo() != null) {
            user = userRepository.findById(dto.getAssignedTo())
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + dto.getAssignedTo()));
            leadBuilder.assignedTo(user);
        }

        Lead lead = leadBuilder.build();
        Lead saved = leadRepository.save(lead); // Save the lead first to get ID

        // ✅ Now create the notification with the lead reference
        if (user != null) {
            Notification notification = Notification.builder()
                    .user(user)
                    .lead(saved) // Set lead here
                    .message("You have been assigned a new lead: " + dto.getName())
                    .read(false)
                    .timestamp(LocalDateTime.now())
                    .build();

            notificationRepository.save(notification);

        }

        return ResponseEntity.ok(saved);
    }


    @PutMapping("/{id}/assign")
    public Lead assignLead(@PathVariable Long id, @RequestParam Long userId) {
        Lead lead = leadRepository.findById(id).orElse(null);
        User user = userRepository.findById(userId).orElse(null);

        if (lead != null && user != null) {
            lead.setAssignedTo(user);
            leadRepository.save(lead);

            // ✅ Create a notification for the assigned user with lead
            Notification notification = Notification.builder()
                    .user(user)
                    .lead(lead) // Set lead here
                    .message("You have been assigned a new lead: " + lead.getName())
                    .read(false)
                    .timestamp(LocalDateTime.now())
                    .build();

            notificationRepository.save(notification);


            // Create lead activity log
            LeadActivity activity = new LeadActivity();
            activity.setLead(lead);
            activity.setUser(user);
            activity.setAction("Manual Assignment");
            activity.setNote("Lead manually assigned to " + user.getName());
            activity.setTimestamp(LocalDateTime.now());
            leadActivityRepository.save(activity);

            return lead;
        }
        return null;
    }

    @PutMapping("/{id}")
    public Lead updateLead(@PathVariable Long id, @RequestBody Map<String, Object> data) {
        Lead lead = leadRepository.findById(id).orElse(null);
        if (lead == null) return null;

        lead.setName((String) data.get("name"));
        lead.setEmail((String) data.get("email"));
        lead.setPhone((String) data.get("phone"));
        lead.setSource((String) data.get("source"));
        lead.setNotes((String) data.get("notes"));

        Object userIdObj = data.get("assignedTo");
        if (userIdObj != null) {
            Long userId = Long.valueOf(userIdObj.toString());
            User user = userRepository.findById(userId).orElse(null);
            lead.setAssignedTo(user);
        }

        return leadRepository.save(lead);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateLeadStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String note,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime followUpDate,
            @RequestParam(required = false) MultipartFile file,
            @RequestParam(required = false) String closeReason,
            @RequestParam(required = false) String dealValue,
            @RequestParam(required = false) String outcome,
            @RequestParam(required = false) Long assignedUserId,
            @RequestParam Long userId,
            @RequestParam(required = false, defaultValue = "false") boolean assignToProposalCreator,
            @RequestParam(required = false) Optional<Long> proposalCreatorId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String summary


            ) throws IOException {

        Lead lead = leadRepository.findById(id).orElse(null);
        User user = userRepository.findById(userId).orElse(null);

        if (status.equalsIgnoreCase("CONTACTED") && (note == null || note.trim().isEmpty())) {
            return ResponseEntity.badRequest().body("Note is required when status is CONTACTED.");
        }

        if (status.equalsIgnoreCase("FOLLOW_UP") && followUpDate == null) {
            return ResponseEntity.badRequest().body("Follow-up date is required when status is FOLLOW_UP.");
        }

        if (status.equalsIgnoreCase("PROPOSAL_SENT") && (file == null || file.isEmpty())) {
            return ResponseEntity.badRequest().body("File upload is required when status is PROPOSAL_SENT.");
        }


        if (lead == null || user == null)
            return ResponseEntity.badRequest().body("Invalid lead/user");

        LeadStatus newStatus = LeadStatus.valueOf(status);
        lead.setStatus(newStatus);

        if (category != null && !category.trim().isEmpty()) {
            lead.setCategory(LeadCategory.valueOf(category)); // Ensure your Lead entity has a setCategory method
        }

        // 🔹 Handle outcome logic if CLOSED
        String actionMessage = "Moved to " + newStatus;;

        if (assignToProposalCreator && proposalCreatorId.isPresent()) {
            User proposalCreator = userRepository.findById(proposalCreatorId.get()).orElse(null);
            if (proposalCreator != null) {
                actionMessage = "Proposal request sent to " + proposalCreator.getName() + " and status moved to " + newStatus;
            } else {
                actionMessage = "Proposal request sent and status moved to " + newStatus;
            }
        }


        if (newStatus == LeadStatus.CLOSED) {
            if (outcome == null) {
                return ResponseEntity.badRequest().body("Outcome must be specified when status is CLOSED");
            }

            LeadOutcome newOutcome;
            try {
                newOutcome = LeadOutcome.valueOf(outcome.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid outcome value. Must be WON or LOST.");
            }

            lead.setOutcome(newOutcome);
            lead.setCompletedAt(LocalDateTime.now());

            if (newOutcome == LeadOutcome.WON && dealValue != null) {
                lead.setDealValue(dealValue);
                actionMessage = "Closed as WON - Deal Value: ₹" + dealValue;
            } else if (newOutcome == LeadOutcome.LOST && closeReason != null) {
                actionMessage = "Closed as LOST";
                note = "Reason: " + closeReason;
            }

            // 🔥 ADD NOTIFICATION TO ADMIN HERE
            List<User> admins = userRepository.findByRole(Role.valueOf("ADMIN")); // Assuming you have a role field in User
            for (User admin : admins) {
                Notification notification = Notification.builder()
                        .user(admin)
                        .lead(lead)
                        .message("Lead " + lead.getName() + " has been closed by " + user.getName())
                        .read(false)
                        .timestamp(LocalDateTime.now())
                        .build();
                notificationRepository.save(notification);
            }
            // 🔥 END

        } else {
            // 🔹 Clear outcome if moving away from CLOSED
            lead.setOutcome(null);
            lead.setCompletedAt(null);
            lead.setDealValue(null);
        }

        leadRepository.save(lead);


        // 🔹 File upload (if present)
        String fileUrl = null;
        if (file != null && !file.isEmpty()) {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get("uploads").resolve(fileName);
            Files.createDirectories(filePath.getParent());
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            fileUrl = filePath.toString();
        }

        // 🔹 Create activity

            LeadActivity activity = LeadActivity.builder()
                    .lead(lead)
                    .user(user)
                    .action(actionMessage)
                    .note(note)

                    .fileUrl(fileUrl)
                    .timestamp(LocalDateTime.now())
                    .build();

            leadActivityRepository.save(activity);


        // 🔹 Create follow-up if needed
        if (followUpDate != null) {
            lead.setStatus(LeadStatus.FOLLOW_UP); // override
            lead.setOutcome(null); // optional: clear outcome if jumping to follow-up
            leadRepository.save(lead);

            FollowUp followUp = new FollowUp();
            followUp.setLead(lead);
            followUp.setNote(note);
            followUp.setFollowUpDate(followUpDate);
            followUpRepository.save(followUp);

            // Calculate time left for reminder message
            LocalDateTime now = LocalDateTime.now();
            Duration duration = Duration.between(now, followUpDate);

            long hours = duration.toHours();
            long minutes = duration.toMinutes() % 60;

            String timeLeft;
            if (hours > 0) {
                timeLeft = hours + (hours == 1 ? " hour" : " hours");
                if (minutes > 0) {
                    timeLeft += " " + minutes + " minutes";
                }
            } else if (minutes > 0) {
                timeLeft = minutes + (minutes == 1 ? " minute" : " minutes");
            } else {
                timeLeft = "moments";
            }

            Reminder reminder = Reminder.builder()
                    .userId(user.getId()) // or whoever should receive the reminder
                    .message("Follow up with " + lead.getName() + " in " + timeLeft)
                    .followUpTime(followUpDate)
                    .leadId(lead.getId())
                    .notified(false)
                    .build();

            reminderRepository.save(reminder);

            // 🔹 Add follow-up activity
            LeadActivity followUpActivity = LeadActivity.builder()
                    .lead(lead)
                    .user(user)
                    .action("Scheduled to FOLLOW_UP (" + followUpDate + ")")
                    .note(note)
                    .timestamp(LocalDateTime.now())
                    .build();
            leadActivityRepository.save(followUpActivity);

            // Send notification to all admins
            List<User> admins = userRepository.findByRole(Role.ADMIN);
            String actorName = (user != null && user.getName() != null) ? user.getName() : "Someone";

            String message = actorName + " has set a follow-up date (" + followUpDate + ") for lead " + lead.getName();

            for (User admin : admins) {
                Notification notification = Notification.builder()
                        .user(admin) // recipient
                        .lead(lead)
                        .message(message)
                        .read(false)
                        .timestamp(LocalDateTime.now())
                        .build();
                notificationRepository.save(notification);
            }
        }

        return ResponseEntity.ok(lead);
    }

    @PutMapping("/{leadId}/update-followup-date")
    public ResponseEntity<String> updateFollowUp(
            @PathVariable Long leadId,
            @RequestBody Map<String, String> request) {

        Optional<Lead> leadOpt = leadRepository.findById(leadId);
        if (leadOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lead not found.");
        }

        Lead lead = leadOpt.get();
        String userIdStr = request.get("userId");
        String followUpDateStr = request.get("followUpDate");
        String summary = request.get("summary");

        if (userIdStr == null || userIdStr.isEmpty()) {
            return ResponseEntity.badRequest().body("User ID is required.");
        }

        User user = userRepository.findById(Long.parseLong(userIdStr)).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        // 1. Mark the latest FollowUp as completed with summary
        Optional<FollowUp> latestFollowUpOpt = followUpRepository.findByLeadId(leadId)
                .stream().max(Comparator.comparing(FollowUp::getFollowUpDate));

        if (latestFollowUpOpt.isPresent()) {
            FollowUp existingFollowUp = latestFollowUpOpt.get();
            if (summary != null && !summary.isEmpty()) {
                existingFollowUp.setSummary(summary);
            }
            existingFollowUp.setCompleted(true);
            followUpRepository.save(existingFollowUp);
        }

        // 2. Create new FollowUp if a new date is provided
        if (followUpDateStr != null && !followUpDateStr.isEmpty()) {
            LocalDateTime newDateTime = LocalDateTime.parse(followUpDateStr);


            FollowUp newFollowUp = FollowUp.builder()
                    .lead(lead)
                    .user(user)
                    .followUpDate(newDateTime)
                    .completed(false)
                    .build();

            followUpRepository.save(newFollowUp);
        }

        // 3. Log a new LeadActivity with the summary in note
        String action = (followUpDateStr == null || followUpDateStr.isEmpty())
                ? "Follow-Up Completed"
                : "Scheduled Follow-Up ("+ followUpDateStr +")";

        LeadActivity activity = LeadActivity.builder()
                .lead(lead)
                .user(user)
                .action(action)
                .note(summary) // using note to store summary
                .timestamp(LocalDateTime.now())
                .build();

        leadActivityRepository.save(activity);

        return ResponseEntity.ok("Follow-up updated successfully!");
    }



    @PutMapping("/assign-random")
    public String assignSelectedLeadsRandomly(@RequestBody List<Long> leadIds) {
        List<Lead> leadsToAssign = leadRepository.findAllById(leadIds)
                .stream()
                .filter(l -> l.getAssignedTo() == null)
                .toList();

        // Only fetch non-admin users
        List<User> users = userRepository.findAll()
                .stream()
                .filter(user -> !"ADMIN".equalsIgnoreCase(String.valueOf(user.getRole())))
                .toList();

        if (leadsToAssign.isEmpty() || users.isEmpty()) {
            return "No unassigned leads or assignable users found";
        }

        Random random = new Random();
        for (Lead lead : leadsToAssign) {
            if (users.isEmpty()) continue; // extra safe guard

            User randomUser = users.get(random.nextInt(users.size()));
            if (randomUser == null) continue; // guard against accidental null

            lead.setAssignedTo(randomUser);
            leadRepository.save(lead);

            // Log activity
            LeadActivity activity = new LeadActivity();
            activity.setLead(lead);
            activity.setUser(randomUser);
            activity.setAction("Random Assignment");
            activity.setNote("Assigned to " + randomUser.getName() + " by system");
            activity.setTimestamp(LocalDateTime.now());
            leadActivityRepository.save(activity);
        }

        return "Selected leads randomly assigned";
    }

    @PutMapping("/{id}/update-category")
    public ResponseEntity<Lead> updateLeadCategory(@PathVariable Long id, @RequestParam LeadCategory category) {
        Optional<Lead> leadOptional = leadRepository.findById(id);
        if (leadOptional.isPresent()) {
            Lead lead = leadOptional.get();
            lead.setCategory(category);
            leadRepository.save(lead);
            return ResponseEntity.ok(lead);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<String> deleteLead(@PathVariable Long id) {
        Optional<Lead> leadOpt = leadRepository.findById(id);
        if (leadOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lead not found");
        }

        Lead lead = leadOpt.get();

        // Delete related follow-ups
        followUpRepository.deleteByLeadId(lead.getId());

        // Delete related activities
        leadActivityRepository.deleteByLeadId(lead.getId());

        notificationRepository.deleteByLeadId(lead.getId());

        proposalRequestRepository.deleteByLeadId(lead.getId());

        // Delete lead
        leadRepository.delete(lead);

        return ResponseEntity.ok("Lead and associated data deleted successfully");
    }

    @GetMapping("/filters")
    public Map<String, List<String>> getLeadFilters() {
        Map<String, List<String>> filters = new HashMap<>();

        // Example enum conversion
        filters.put("statuses", Arrays.stream(LeadStatus.values()).map(Enum::name).toList());
        filters.put("outcomes", Arrays.stream(LeadOutcome.values()).map(Enum::name).toList());
        filters.put("categories", Arrays.stream(LeadCategory.values()).map(Enum::name).toList());

        // Source values from DB (assuming it's a String column)
        List<String> sources = leadRepository.findDistinctSources();
        filters.put("sources", sources);

        return filters;
    }

}
