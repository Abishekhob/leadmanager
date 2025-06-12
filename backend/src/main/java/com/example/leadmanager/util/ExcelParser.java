package com.example.leadmanager.util;

import com.example.leadmanager.model.Lead;
import com.example.leadmanager.model.enums.LeadStatus;
import org.apache.poi.ss.usermodel.*;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class ExcelParser {

    private static String getCellValueAsString(Cell cell) {
        if (cell == null) return "";

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                } else {
                    double numericValue = cell.getNumericCellValue();
                    // Optional: format without decimal if it's a whole number
                    if (numericValue == (long) numericValue) {
                        return String.valueOf((long) numericValue);
                    }
                    return String.valueOf(numericValue);
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            case BLANK:
                return "";
            default:
                return cell.toString();
        }
    }


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
            lead.setName(getCellValueAsString(row.getCell(0)));
            lead.setEmail(getCellValueAsString(row.getCell(1)));
            lead.setPhone(getCellValueAsString(row.getCell(2)));

            Cell sourceCell = row.getCell(3);
            lead.setSource(sourceCell != null && !sourceCell.toString().isEmpty() ? sourceCell.toString() : "Manual");

            lead.setStatus(LeadStatus.NEW);
            leads.add(lead);
        }

        workbook.close();
        return leads;
    }

}
