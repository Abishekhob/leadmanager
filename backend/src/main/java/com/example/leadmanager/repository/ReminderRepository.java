package com.example.leadmanager.repository;


import com.example.leadmanager.model.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    @Query(value = "SELECT * FROM reminder r WHERE r.notified = false AND r.follow_up_time BETWEEN :now AND :twoHoursFromNow",
            nativeQuery = true)
    List<Reminder> findDueReminders(
            @Param("now") LocalDateTime now,
            @Param("twoHoursFromNow") LocalDateTime twoHoursFromNow
    );

    List<Reminder> findByUserIdAndFollowUpTimeBetweenAndNotifiedFalse(
            Long userId,
            LocalDateTime start,
            LocalDateTime end
    );


}
