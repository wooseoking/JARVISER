package com.ssafy.jarviser.service;

import com.ssafy.jarviser.dto.ResponseMessage;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WSService {

    private final SimpMessagingTemplate messagingTemplate;

    public void send(final String message) {
        ResponseMessage responseMessage = new ResponseMessage(message);
        messagingTemplate.convertAndSend("/topic/message", responseMessage);
    }
}
