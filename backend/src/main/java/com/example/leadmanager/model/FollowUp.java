package com.example.leadmanager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "follow_ups")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FollowUp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Lead lead;

    @ManyToOne
    private User user;

    @Column(name = "follow_up_date", columnDefinition = "TIMESTAMP")
    private LocalDateTime followUpDate;

    private String note;

    private boolean completed;

    @Column(columnDefinition = "TEXT")
    private String summary;

}