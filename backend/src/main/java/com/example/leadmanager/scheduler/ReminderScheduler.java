package com.example.leadmanager.scheduler;

import com.example.leadmanager.model.Reminder;
import com.example.leadmanager.repository.ReminderRepository;
import com.example.leadmanager.service.ReminderNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReminderScheduler {

    private final ReminderRepository reminderRepository;
    private final ReminderNotificationService notificationService;

    @Scheduled(fixedRate = 60000)
    public void checkDueReminders() {
        LocalDateTime now = LocalDateTime.now();
        List<Reminder> dueReminders = reminderRepository.findDueReminders(now);

        for (Reminder reminder : dueReminders) {
            log.info("Reminder for user {}: {}", reminder.getUserId(), reminder.getMessage());

            // Send WebSocket notification
            notificationService.sendReminderNotification(reminder.getUserId(), reminder.getMessage());

            reminder.setNotified(true);
            reminderRepository.save(reminder);
        }
    }
}


