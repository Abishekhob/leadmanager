// package: com.example.leadmanager.dto
package com.example.leadmanager.dto;

import lombok.Data;

@Data
public class RegisterAdminRequest {
    private String name;
    private String email;
    private String password;
}
