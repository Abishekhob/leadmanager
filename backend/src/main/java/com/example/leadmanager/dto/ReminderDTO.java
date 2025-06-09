package com.example.leadmanager.dto;

import com.example.leadmanager.model.Reminder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ReminderDTO {
    private String message;
    private LocalDateTime followUpTime;
    private Long leadId;

    public ReminderDTO(Reminder r) {
        this.message = r.getMessage();
        this.followUpTime = r.getFollowUpTime();
        this.leadId=r.getLeadId();
    }
}
