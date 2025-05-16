package com.example.leadmanager.service;

import com.example.leadmanager.model.Lead;
import com.example.leadmanager.model.User;
import com.example.leadmanager.model.enums.LeadStatus;
import com.example.leadmanager.repository.LeadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LeadServiceImpl implements LeadService {

    private final LeadRepository leadRepository;

    @Autowired
    public LeadServiceImpl(LeadRepository leadRepository) {
        this.leadRepository = leadRepository;
    }

    @Override
    public Lead createLead(Lead lead) {
        return leadRepository.save(lead);
    }

    @Override
    public Optional<Lead> getLeadById(Long id) {
        return leadRepository.findById(id);
    }

    @Override
    public List<Lead> getAllLeads() {
        return leadRepository.findAll();
    }

    @Override
    public List<Lead> getLeadsByUser(User user) {
        return leadRepository.findByAssignedTo(user);
    }

    @Override
    public Lead updateLeadStatus(Long leadId, String status) {
        Optional<Lead> leadOpt = leadRepository.findById(leadId);
        if (leadOpt.isPresent()) {
            Lead lead = leadOpt.get();
            lead.setStatus(LeadStatus.valueOf(status));
            return leadRepository.save(lead);
        }
        return null;
    }
}
