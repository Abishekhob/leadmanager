package com.example.leadmanager.util;

import com.example.leadmanager.model.Lead;
import com.example.leadmanager.model.enums.LeadStatus;
import com.opencsv.CSVReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class CsvParser {

    public static List<Lead> parse(InputStream inputStream) throws Exception {
        List<Lead> leads = new ArrayList<>();
        CSVReader reader = new CSVReader(new InputStreamReader(inputStream));
        String[] line;
        boolean header = true;

        while ((line = reader.readNext()) != null) {
            if (header) {
                header = false;
                continue;
            }

            Lead lead = new Lead();
            lead.setName(line.length > 0 ? line[0] : "");
            lead.setEmail(line.length > 1 ? line[1] : "");
            lead.setPhone(line.length > 2 ? line[2] : "");
            lead.setSource(line.length > 3 && !line[3].isEmpty() ? line[3] : "Manual");
            lead.setStatus(LeadStatus.NEW);

            leads.add(lead);
        }
        return leads;
    }
}
