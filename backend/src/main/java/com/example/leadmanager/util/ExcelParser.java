package com.example.leadmanager.util;

import com.example.leadmanager.model.Lead;
import com.example.leadmanager.model.enums.LeadStatus;
import org.apache.poi.ss.usermodel.*;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class ExcelParser {

    public static List<Lead> parse(InputStream inputStream) throws Exception {
        List<Lead> leads = new ArrayList<>();

        Workbook workbook = WorkbookFactory.create(inputStream);
        Sheet sheet = workbook.getSheetAt(0);
        Iterator<Row> rows = sheet.iterator();
        boolean header = true;

        while (rows.hasNext()) {
            Row row = rows.next();
            if (header) {
                header = false;
                continue;
            }

            Lead lead = new Lead();
            lead.setName(row.getCell(0).getStringCellValue());
            lead.setEmail(row.getCell(1).getStringCellValue());
            lead.setPhone(row.getCell(2).getStringCellValue());

            Cell sourceCell = row.getCell(3);
            lead.setSource(sourceCell != null && !sourceCell.toString().isEmpty() ? sourceCell.toString() : "Manual");

            lead.setStatus(LeadStatus.NEW);
            leads.add(lead);
        }

        workbook.close();
        return leads;
    }
}
