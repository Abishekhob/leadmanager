package com.example.leadmanager.dto;

import com.example.leadmanager.model.ProposalRequest;
import lombok.Data;

@Data
public class ProposalDTO {
    private Long id;
    private String notes;
    private String referenceFilePath;
    private String proposalFilePath;
    private boolean completed;
    private String proposalUploadedAt;
    private String createdAt;
    private String leadName;
    private Long leadId;
    private String assignedToName;
    private String requestedByName;

    // constructor that maps from ProposalRequest entity
    public ProposalDTO(ProposalRequest p) {
        this.id = p.getId();
        this.notes = p.getNotes();
        this.referenceFilePath = p.getReferenceFilePath();
        this.proposalFilePath = p.getProposalFilePath();
        this.completed = p.isCompleted();
        this.proposalUploadedAt = p.getProposalUploadedAt() != null ? p.getProposalUploadedAt().toString() : null;
        this.createdAt = p.getCreatedAt().toString();
        this.leadId = p.getLead().getId();
        this.leadName = p.getLead().getName(); // assuming you have a Lead entity with getName()
        this.assignedToName = p.getAssignedTo() != null ? p.getAssignedTo().getName() : null;
        this.requestedByName = p.getRequestedBy() != null ? p.getRequestedBy().getName() : null;
    }

    // getters and setters
}

