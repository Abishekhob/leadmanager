package com.example.leadmanager.repository;


import com.example.leadmanager.model.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    @Query("SELECT r FROM Reminder r WHERE r.followUpTime <= :now AND r.notified = false")
    List<Reminder> findDueReminders(LocalDateTime now);
}
