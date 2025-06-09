package com.example.leadmanager.repository;

import com.example.leadmanager.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdAndReadFalse(Long userId);
    List<Notification> findByUser_Id(Long userId);

    void deleteByLeadId(Long id);

    List<Notification> findByUser_IdOrderByTimestampDesc(Long userId);

    int countByUserIdAndReadFalse(Long userId);
}
