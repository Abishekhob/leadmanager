package com.example.leadmanager.service;

import com.example.leadmanager.dto.ReminderDTO;
import com.example.leadmanager.model.Lead;
import com.example.leadmanager.model.Notification;
import com.example.leadmanager.model.Reminder;
import com.example.leadmanager.model.User;
import com.example.leadmanager.repository.LeadRepository;
import com.example.leadmanager.repository.NotificationRepository;
import com.example.leadmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReminderNotificationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final LeadRepository leadRepository;

    public void sendReminderNotification(Reminder reminder) {
        if (reminder.getUserId() == null) {
            // Optionally log this
            return;
        }

        User recipient = userRepository.findById(reminder.getUserId()).orElse(null);
        Lead lead = null;

        if (reminder.getLeadId() != null) {
            lead = leadRepository.findById(reminder.getLeadId()).orElse(null);
        }

        if (recipient != null) {
            Notification notification = Notification.builder()
                    .user(recipient)
                    .lead(lead)
                    .message(reminder.getMessage())
                    .read(false)
                    .timestamp(LocalDateTime.now())
                    .build();
            notificationRepository.save(notification);
        }

        ReminderDTO dto = new ReminderDTO(reminder);
        messagingTemplate.convertAndSend("/topic/reminder/" + reminder.getUserId(), dto);
    }

}
