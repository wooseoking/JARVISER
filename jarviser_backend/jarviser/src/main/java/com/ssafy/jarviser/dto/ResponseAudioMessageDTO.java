package com.ssafy.jarviser.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResponseAudioMessageDTO {
    private long audioMessageId;
    private String name;
    private String content;
    private int length;
    private LocalDateTime startTime;
    private String filePath;
    private long priority;
}
