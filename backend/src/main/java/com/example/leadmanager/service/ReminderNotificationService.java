package com.example.leadmanager.service;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReminderNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendReminderNotification(Long userId, String message) {
        // Send to specific user topic
        messagingTemplate.convertAndSend("/topic/reminder/" + userId, message);
    }
}

