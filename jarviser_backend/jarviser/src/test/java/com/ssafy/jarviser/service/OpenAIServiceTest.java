package com.ssafy.jarviser.service;

import com.ssafy.jarviser.domain.AudioMessage;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;

@SpringBootTest
class OpenAIServiceTest {

    @Autowired
    OpenAIService openAIService;

    @Autowired
    MeetingService meetingService;

    @Test
    @DisplayName("회원 가입 테스팅")
    void testChatGPT() throws URISyntaxException, IOException {
//        String text = openAIService.chatGPTPartSummary("C:\\Users\\SSAFY\\IdeaProjects\\S09P12A506\\text\\hi.txt").block();
//        System.out.println(text);
    }


    @Test
    @DisplayName("keywordTesting")
    @Transactional
    @Rollback(value = false)
    void testKeywordExtraction() throws URISyntaxException, IOException {
        List<AudioMessage> audioMessages = meetingService.findAllAudioMessage(1);
        List<String> keywords = openAIService.chatGTPKeywords(audioMessages);

    }

}