package com.example.leadmanager.controller;


import com.example.leadmanager.dto.ReminderDTO;
import com.example.leadmanager.model.Reminder;
import com.example.leadmanager.repository.ReminderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;


@RestController
@RequestMapping("/api/reminders")
@RequiredArgsConstructor
public class ReminderController {

    private final ReminderRepository reminderRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping("/save")
    public ResponseEntity<String> saveReminder(@RequestBody Reminder reminder) {
        // Make sure notified is false by default if not set
        if (reminder.isNotified() == false) {
            reminder.setNotified(false);
        }
        reminderRepository.save(reminder);
        return ResponseEntity.ok("Reminder saved successfully");
    }

    @PostMapping("/test/{userId}")
    public ResponseEntity<String> sendTestReminder(@PathVariable Long userId) {
        messagingTemplate.convertAndSend("/topic/reminder/" + userId, "This is a test reminder!");
        return ResponseEntity.ok("Test reminder sent to user " + userId);
    }

    @GetMapping("/api/reminders/upcoming")
    public List<ReminderDTO> getUpcomingReminders(@RequestParam Long userId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime target = now.plusHours(2).plusMinutes(1); // slight buffer

        List<Reminder> reminders = reminderRepository
                .findByUserIdAndFollowUpTimeBetweenAndNotifiedFalse(userId, now, target);

        for (Reminder reminder : reminders) {
            reminder.setNotified(true); // mark as shown
            reminderRepository.save(reminder);
        }

        return reminders.stream().map(ReminderDTO::new).toList();
    }


}
