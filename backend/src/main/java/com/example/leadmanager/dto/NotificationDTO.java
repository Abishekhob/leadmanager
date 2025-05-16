package com.example.leadmanager.dto;

import com.example.leadmanager.model.Notification;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {

    private Long id;
    private String message;
    private boolean read;
    private LocalDateTime timestamp;
    private Long userId; // ID of the user the notification is for
    private Long leadId; // ID of the associated lead

    public static NotificationDTO from(Notification notification) {
        return new NotificationDTO(
                notification.getId(),
                notification.getMessage(),
                notification.isRead(),
                notification.getTimestamp(),
                notification.getUser() != null ? notification.getUser().getId() : null,
                notification.getLead() != null ? notification.getLead().getId() : null
        );
    }
}
