package com.ssafy.jarviser.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RequestPasswordDto {
    private String password;
}
