package com.example.leadmanager.scheduler;

import com.example.leadmanager.model.Reminder;
import com.example.leadmanager.repository.ReminderRepository;
import com.example.leadmanager.service.ReminderNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReminderScheduler {

    private final ReminderRepository reminderRepository;
    private final ReminderNotificationService notificationService;

    @Scheduled(cron = "0 */5 * * * *") // Every 5 minutes
    public void checkDueReminders() {
        try {
            ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Kolkata"));
            ZonedDateTime twoHoursFromNow = now.plusHours(2);

            List<Reminder> dueReminders = reminderRepository.findDueReminders(
                    now.toLocalDateTime(),
                    twoHoursFromNow.toLocalDateTime()
            );

            if (dueReminders.isEmpty()) {
                log.info("No reminders due for notification at {}", now);
                return;
            }

            log.info("Found {} reminders due for notification at {}", dueReminders.size(), now);

            for (Reminder reminder : dueReminders) {
                log.info("Sending reminder to user {}: {}", reminder.getUserId(), reminder.getMessage());
                notificationService.sendReminderNotification(reminder);
                reminder.setNotified(true);
            }

            reminderRepository.saveAll(dueReminders);

        } catch (Exception e) {
            log.error("Error checking/sending reminders", e);
        }
    }
}
