package com.ssafy.jarviser.dto;

import lombok.*;

@Builder
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class KeywordStatisticsDTO {
    String keyword;
    double percent;
}
