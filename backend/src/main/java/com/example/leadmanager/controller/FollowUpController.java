package com.example.leadmanager.controller;

import com.example.leadmanager.model.FollowUp;
import com.example.leadmanager.repository.FollowUpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/followups")
public class FollowUpController {

    @Autowired
    private FollowUpRepository followUpRepository;

    // 🔹 For a specific lead (with sorting)
    @GetMapping("/lead/{leadId}")
    public List<FollowUp> getFollowUpsByLead(@PathVariable Long leadId) {
        return followUpRepository.findByLeadIdOrderByFollowUpDateAsc(leadId);
    }

    // 🔹 For a specific user – shows only upcoming follow-ups
    @GetMapping("/user/{userId}")
    public List<FollowUp> getFollowUpsByUser(@PathVariable Long userId) {
        return followUpRepository.findByLead_AssignedTo_IdAndFollowUpDateAfterOrderByFollowUpDateAsc(
                userId, LocalDate.now());
    }

    // 🔹 Create a follow-up
    @PostMapping
    public FollowUp createFollowUp(@RequestBody FollowUp followUp) {
        return followUpRepository.save(followUp);
    }
}
