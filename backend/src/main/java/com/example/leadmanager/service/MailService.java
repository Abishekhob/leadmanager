package com.example.leadmanager.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendInvite(String toEmail, String inviteLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("abishekhjuve@gmail.com");
        message.setTo(toEmail);
        message.setSubject("You're invited to join!");
        message.setText("Hi there,\n\nClick the link below to set your password and join:\n" + inviteLink + "\n\nThanks!");

        mailSender.send(message);
    }
}

