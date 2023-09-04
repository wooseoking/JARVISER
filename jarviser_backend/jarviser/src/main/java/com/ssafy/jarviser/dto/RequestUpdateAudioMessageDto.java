package com.ssafy.jarviser.dto;

import lombok.*;

@Builder
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor

public class RequestUpdateAudioMessageDto {
    private long audioMessageId;
    private String content;
}
