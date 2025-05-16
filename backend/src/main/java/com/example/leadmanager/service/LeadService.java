package com.example.leadmanager.service;

import com.example.leadmanager.model.Lead;
import com.example.leadmanager.model.User;

import java.util.List;
import java.util.Optional;

public interface LeadService {
    Lead createLead(Lead lead);
    Optional<Lead> getLeadById(Long id);
    List<Lead> getAllLeads();
    List<Lead> getLeadsByUser(User user);
    Lead updateLeadStatus(Long leadId, String status);
}

