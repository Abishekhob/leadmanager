package com.example.leadmanager.repository;

import com.example.leadmanager.model.User;
import com.example.leadmanager.model.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    List<User> findByRole(Role role);


    Optional<User> findByInviteToken(String token);
}
