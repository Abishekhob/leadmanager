package com.example.leadmanager.controller;

import com.example.leadmanager.service.LeadUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/leads")
public class LeadUploadController {

    @Autowired
    private LeadUploadService leadUploadService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadLeads(@RequestParam("file") MultipartFile file) {
        String result = leadUploadService.processLeadFile(file);
        return ResponseEntity.ok(result);
    }
}
