package com.ssafy.jarviser.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
@Data
@AllArgsConstructor
public class SignupRequestDto {
    private String email;
    private String password;
    private String name;
}
