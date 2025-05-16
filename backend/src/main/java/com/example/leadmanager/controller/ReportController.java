package com.example.leadmanager.controller;

import com.example.leadmanager.repository.FollowUpRepository;
import com.example.leadmanager.repository.LeadActivityRepository;
import com.example.leadmanager.repository.LeadRepository;
import com.example.leadmanager.repository.ProposalRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private LeadRepository leadRepository;

    @Autowired
    private LeadActivityRepository leadActivityRepository;

    @Autowired
    private FollowUpRepository followUpRepository;

    @Autowired
    private ProposalRequestRepository proposalActivityRepository;

    @GetMapping("/leads-by-source")
    public List<Object[]> getLeadsBySource() {
        return leadRepository.getLeadsBySource();
    }

    @GetMapping("/lead-outcomes")
    public List<Object[]> getLeadOutcomes() {
        return leadRepository.getLeadOutcomes();
    }

    @GetMapping("/proposal-completion")
    public List<Object[]> getProposalCompletion() {
        return proposalActivityRepository.getProposalCompletion();
    }

    @GetMapping("/lead-activity-frequency")
    public List<Object[]> getLeadActivityFrequency() {
        return leadActivityRepository.getActivityFrequency();
    }

    @GetMapping("/user-activity-volume")
    public List<Object[]> getUserActivityVolume() {
        return leadActivityRepository.getUserActivityVolume();
    }

    @GetMapping("/follow-up-completion")
    public List<Map<String, Object>> getFollowUpCompletion() {
        List<Object[]> results = followUpRepository.getFollowUpCompletion();
        List<Map<String, Object>> response = new ArrayList<>();

        for (Object[] row : results) {
            System.out.println("Status: " + row[0] + ", Count: " + row[1]);  // 👈 Log output
            Map<String, Object> item = new HashMap<>();
            item.put("status", row[0]);
            item.put("count", row[1]);
            response.add(item);
        }

        return response;
    }


}
