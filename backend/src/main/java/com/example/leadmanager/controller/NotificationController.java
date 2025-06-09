package com.example.leadmanager.controller;

import com.example.leadmanager.dto.NotificationDTO;
import com.example.leadmanager.model.Notification;
import com.example.leadmanager.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/user/{userId}")
    public List<NotificationDTO> getUserNotifications(@PathVariable Long userId) {
        List<Notification> notifications = notificationRepository.findByUser_IdOrderByTimestampDesc(userId);
        return notifications.stream()
                .map(NotificationDTO::from)  // Convert to DTO
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}/read")
    public NotificationDTO markAsRead(@PathVariable Long id) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification != null) {
            notification.setRead(true);
            Notification updatedNotification = notificationRepository.save(notification);
            return NotificationDTO.from(updatedNotification); // Return updated DTO
        }
        return null;
    }

    @PostMapping
    public NotificationDTO createNotification(@RequestBody Notification notification) {
        Notification savedNotification = notificationRepository.save(notification);
        return NotificationDTO.from(savedNotification); // Return created DTO
    }

    @DeleteMapping("/user/{userId}/clear")
    public ResponseEntity<?> clearAllNotifications(@PathVariable Long userId) {
        List<Notification> notifications = notificationRepository.findByUser_Id(userId);

        boolean hasUnread = notifications.stream().anyMatch(n -> !n.isRead());

        // Delete all notifications for the user
        notificationRepository.deleteAll(notifications);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("hadUnread", hasUnread);  // So frontend can show a confirmation before calling this if needed

        return ResponseEntity.ok(response);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Integer> getUnreadNotificationCount(@RequestParam Long userId) {
        int unreadCount = notificationRepository.countByUserIdAndReadFalse(userId);
        return ResponseEntity.ok(unreadCount);
    }

}
