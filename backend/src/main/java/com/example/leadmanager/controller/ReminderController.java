package com.example.leadmanager.controller;


import com.example.leadmanager.model.Reminder;
import com.example.leadmanager.repository.ReminderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;


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


}
