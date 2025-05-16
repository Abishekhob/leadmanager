package com.example.leadmanager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "lead_activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Lead lead;

    @ManyToOne
    private User user;

    private String action;

    @Column(columnDefinition = "TEXT")
    private String note;

    private String fileUrl; // optional

    private LocalDateTime timestamp;
}
