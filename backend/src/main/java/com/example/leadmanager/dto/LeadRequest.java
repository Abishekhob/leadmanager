package com.example.leadmanager.dto;

import com.example.leadmanager.model.enums.LeadStatus;
import lombok.Data;

@Data
public class LeadRequest {
    private String name;
    private String email;
    private String phone;
    private String source;
    private LeadStatus status; // optional, default can be NEW
    private String notes; // optional, if you want to expand
    private Long assignedTo; // this is user ID
}
