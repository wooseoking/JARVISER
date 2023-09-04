package com.ssafy.jarviser.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ResponseMeetingDto {
    String meetingName;
    String hostName;
    LocalDateTime date;
    String encryptedKey;
}
