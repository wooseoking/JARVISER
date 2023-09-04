package com.ssafy.jarviser.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ResponseChatGPTKeywordsDTO {
    @Getter
    @Setter
    public static class Choice {
        @Getter
        @Setter
        public static class Message {
            private String role;
            private String content;
        }
        private Message message;
    }

    private List<Choice> choices;

}
