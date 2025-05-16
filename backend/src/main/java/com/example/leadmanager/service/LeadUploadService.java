package com.example.leadmanager.service;

import com.example.leadmanager.model.Lead;
import com.example.leadmanager.repository.LeadRepository;
import com.example.leadmanager.util.CsvParser;
import com.example.leadmanager.util.ExcelParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class LeadUploadService {

    @Autowired
    private LeadRepository leadRepository;

    public String processLeadFile(MultipartFile file) {
        String fileName = file.getOriginalFilename();

        try {
            List<Lead> leads;

            if (fileName != null && fileName.endsWith(".csv")) {
                leads = CsvParser.parse(file.getInputStream());
            } else if (fileName != null && (fileName.endsWith(".xls") || fileName.endsWith(".xlsx"))) {
                leads = ExcelParser.parse(file.getInputStream());
            } else {
                return "Unsupported file type.";
            }

            leadRepository.saveAll(leads);
            return leads.size() + " leads imported successfully.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error importing leads: " + e.getMessage();
        }
    }
}
