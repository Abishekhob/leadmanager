package com.example.leadmanager.controller;

import com.example.leadmanager.dto.NotificationDTO;
import com.example.leadmanager.model.Notification;
import com.example.leadmanager.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/user/{userId}")
    public List<NotificationDTO> getUserNotifications(@PathVariable Long userId) {
        List<Notification> notifications = notificationRepository.findByUser_Id(userId);
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
}
