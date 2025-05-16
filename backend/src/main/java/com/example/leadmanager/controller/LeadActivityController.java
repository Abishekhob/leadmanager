package com.example.leadmanager.controller;

import com.example.leadmanager.model.LeadActivity;
import com.example.leadmanager.repository.LeadActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lead-activities")
public class LeadActivityController {

    @Autowired
    private LeadActivityRepository leadActivityRepository;

    // 🔹 Get all activity logs
    @GetMapping
    public List<LeadActivity> getAllActivities() {
        return leadActivityRepository.findAll();
    }

    // 🔹 Get activities by lead (sorted by latest first)
    @GetMapping("/lead/{leadId}")
    public List<LeadActivity> getActivitiesByLead(@PathVariable Long leadId) {
        return leadActivityRepository.findByLeadIdOrderByTimestampDesc(leadId);
    }

    // 🔹 Add an activity
    @PostMapping
    public LeadActivity addActivity(@RequestBody LeadActivity activity) {
        return leadActivityRepository.save(activity);
    }
}
