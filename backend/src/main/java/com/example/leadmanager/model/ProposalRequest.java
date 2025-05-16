package com.example.leadmanager.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "proposal_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProposalRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Lead this proposal is about
    @ManyToOne
    @JoinColumn(name = "lead_id", nullable = false)
    private Lead lead;

    // User requesting the proposal
    @ManyToOne
    @JoinColumn(name = "requested_by", nullable = false)
    private User requestedBy;

    // User assigned to prepare the proposal (nullable if user uploads directly)
    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "reference_file_path")
    private String referenceFilePath;

    @Column(name = "proposal_file_path")
    private String proposalFilePath;

    private boolean completed;

    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @Column(name = "proposal_uploaded_at")
    private LocalDateTime proposalUploadedAt;

}
