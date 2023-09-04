package com.ssafy.jarviser.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ChatMessageDto {
    private String roomId;
    private String sender;
    private String message;
}
