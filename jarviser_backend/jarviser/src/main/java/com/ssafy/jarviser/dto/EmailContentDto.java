package com.ssafy.jarviser.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmailContentDto {
    private String title;
    private String description;
    private String startTime;
    private List<String> emails;
}
