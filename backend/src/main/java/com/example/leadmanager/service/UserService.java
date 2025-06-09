package com.example.leadmanager.service;

import com.example.leadmanager.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User saveUser(User user);
    Optional<User> getUserById(Long id);
    List<User> getAllUsers();

    boolean resetPassword(Long userId, String newPassword);
}
