package com.ssafy.jarviser.dto;

import lombok.*;

@Builder
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ParticipantsStaticsDTO {
    long id;
    String name;
    double percentage;
}
