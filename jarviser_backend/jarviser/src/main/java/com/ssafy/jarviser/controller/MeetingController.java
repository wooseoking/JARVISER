
package com.ssafy.jarviser.controller;

import com.ssafy.jarviser.domain.*;
import com.ssafy.jarviser.dto.KeywordStatisticsDTO;
import com.ssafy.jarviser.dto.ParticipantsStaticsDTO;
import com.ssafy.jarviser.dto.RequestUpdateAudioMessageDto;
import com.ssafy.jarviser.dto.ResponseAudioMessageDTO;
import com.ssafy.jarviser.repository.ReportRepository;
import com.ssafy.jarviser.security.JwtService;
import com.ssafy.jarviser.service.AudioService;
import com.ssafy.jarviser.service.MeetingService;
import com.ssafy.jarviser.service.OpenAIService;
import com.ssafy.jarviser.service.StatisticsService;
import com.ssafy.jarviser.util.AESEncryptionUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"*"})
@RequestMapping("meeting")
public class MeetingController {
    private final JwtService jwtService;
    private final MeetingService meetingService;
    private final AESEncryptionUtil aesEncryptionUtil;
    private final StatisticsService statisticsService;
    private final AudioService audioService;

    //미팅생성
    @PostMapping("/create/{meetingName}")
    public ResponseEntity<Map<String, Object>> createMeeting(
            @RequestHeader("Authorization") String token,
            @PathVariable String meetingName) {
        log.debug("CreateMeeting............................create meetingName:" + meetingName);

        Map<String, Object> responseMap = new HashMap<>();
        HttpStatus httpStatus = null;
        token = token.split(" ")[1];
        try {
            Long hostId = jwtService.extractUserId(token);
            String encryptedKey = meetingService.createMeeting(hostId, meetingName);
            httpStatus = HttpStatus.ACCEPTED;
            responseMap.put("encryptedKey", encryptedKey);

        } catch (Exception e) {
            log.error("미팅 생성 실패 : {}", e);
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<>(responseMap, httpStatus);
    }

    //미팅 참여
    @GetMapping("/joinMeeting/{encryptedKey}")
    public ResponseEntity<Map<String, Object>> joinMeeting(
            @RequestHeader("Authorization") String token,
            @PathVariable String encryptedKey) {

        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = null;

        try {
            long meetingId = Long.parseLong(aesEncryptionUtil.decrypt(encryptedKey));
            //해당 미팅 id값을 통해 미팅 객체 찾기
            Meeting meeting = meetingService.findMeetingById(meetingId);
            //유저 id jwt토큰을 이용해서 획득
            token = token.split(" ")[1];
            Long joinUserId = jwtService.extractUserId(token);
            meetingService.joinMeeting(joinUserId, meetingId);

            //기존 유저들의 채팅정보 볼수 있게 미팅의 오디오메시지내역도 보내주기
            List<AudioMessage> allAudioMessage = meetingService.findAllAudioMessage(meetingId);
            //DTO로 변환
            List<ResponseAudioMessageDTO> responseAudioMessageDTOList = new ArrayList<>();
            for (AudioMessage audioMessage : allAudioMessage) {
                ResponseAudioMessageDTO responseAudioMessageDTO = ResponseAudioMessageDTO
                        .builder()
                        .length(audioMessage.getSpeechLength())
                        .priority(audioMessage.getPriority())
                        .content(audioMessage.getContent())
                        .startTime(audioMessage.getStartTime())
                        .name(audioMessage.getUser().getName())
                        .filePath(audioMessage.getFilePath())
                        .build();
                responseAudioMessageDTOList.add(responseAudioMessageDTO);
            }
            resultMap.put("audioMessages", responseAudioMessageDTOList);

            status = HttpStatus.ACCEPTED;
        } catch (Exception e) {
            log.error("error", e);
            resultMap.put("message", e.getMessage());
        }
        return new ResponseEntity<>(resultMap, status);
    }


    //미팅 오디오 메시지 불러오는 api
    @GetMapping("/audiomessage/{encryptedKey}")
    public ResponseEntity<Map<String, Object>> meetingAudioMessages(
            @RequestHeader("Authorization") String token,
            @PathVariable String encryptedKey
    ) {
        Map<String, Object> response = new HashMap<>();
        HttpStatus httpStatus = HttpStatus.ACCEPTED;
        try {
            long meetingId = Long.parseLong(aesEncryptionUtil.decrypt(encryptedKey));
            List<AudioMessage> allAudioMessage = meetingService.findAllAudioMessage(meetingId);
            //DTO로 변환
            List<ResponseAudioMessageDTO> responseAudioMessageDTOList = new ArrayList<>();
            for (AudioMessage audioMessage : allAudioMessage) {
                ResponseAudioMessageDTO responseAudioMessageDTO = ResponseAudioMessageDTO
                        .builder()
                        .audioMessageId(audioMessage.getId())
                        .length(audioMessage.getSpeechLength())
                        .priority(audioMessage.getPriority())
                        .content(audioMessage.getContent())
                        .startTime(audioMessage.getStartTime())
                        .name(audioMessage.getUser().getName())
                        .filePath(audioMessage.getFilePath())
                        .build();
                responseAudioMessageDTOList.add(responseAudioMessageDTO);
            }
            response.put("audioMessages", responseAudioMessageDTOList);

        } catch (Exception e) {
            httpStatus = HttpStatus.NOT_ACCEPTABLE;
            throw new RuntimeException(e);
        }
        return new ResponseEntity<>(response, httpStatus);
    }

    //미팅 발화자 통계 불러오는 api
    @GetMapping("/speech/{encryptedKey}")
    public ResponseEntity<Map<String, Object>> meetingSpeech(
            @RequestHeader("Authorization") String token,
            @PathVariable String encryptedKey
    ) {
        Map<String, Object> response = new HashMap<>();
        HttpStatus httpStatus = HttpStatus.OK;
        try {

            long meetingId = Long.parseLong(aesEncryptionUtil.decrypt(encryptedKey));
            //통계 가져오기
            List<ParticipantStatistics> allParticipantStatistics = meetingService.findAllParticipantStatistics(meetingId);

            List<ParticipantsStaticsDTO> responseList = new ArrayList<>();

            for (ParticipantStatistics participantStatistics : allParticipantStatistics) {
                ParticipantsStaticsDTO participantsStaticsDTO = ParticipantsStaticsDTO
                        .builder()
                        .id(participantStatistics.getId())
                        .percentage(participantStatistics.getPercent())
                        .name(participantStatistics.getName())
                        .build();
                responseList.add(participantsStaticsDTO);
            }
            response.put("statistics", responseList);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return new ResponseEntity<>(response, httpStatus);
    }

    @GetMapping("/end/{encryptedKey}")
    public ResponseEntity<Map<String, Object>> meetingEnd(
            @RequestHeader("Authorization") String token,
            @PathVariable String encryptedKey) {
        Map<String, Object> response = new HashMap<>();
        HttpStatus httpStatus = HttpStatus.OK;
        try {

            long meetingId = Long.parseLong(aesEncryptionUtil.decrypt(encryptedKey));
            System.out.println("meeting ID : ---------------->" + meetingId);
            statisticsService.summarizeTranscript(meetingId);

            //  <----- 키워드 디비에 저장 하기 ----->
            //  1. chat gpt 를 이용하여 keyword 통계 계산하기
            List<KeywordStatistics> keywordStatistics = meetingService.caculateKeywordsStatics(meetingId);
            //  2. 계산된 리스트 db에 저장하기
            meetingService.addKeywordStatisticsToMeeting(meetingId, keywordStatistics);

            //발화자 통계 계산하기
            //  1. 발화자 통계 계산하기
            List<ParticipantStatistics> participantsStaticsList = meetingService.caculateParticipantsStatics(meetingId);
            //  2. 계산된 리스트 db에 저장하기
            meetingService.addParticipantsStatisticsToMeeting(meetingId, participantsStaticsList);

            response.put("message", "미팅 종료 처리 완료");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return new ResponseEntity<>(response, httpStatus);
    }


    //미팅 키워드 통계 불러오는 api
    @GetMapping("/keywords/{encryptedKey}")
    public ResponseEntity<Map<String, Object>> meetingKeywords(
            @RequestHeader("Authorization") String token,
            @PathVariable String encryptedKey
    ) {

        Map<String, Object> response = new HashMap<>();
        HttpStatus httpStatus = HttpStatus.OK;
        try {

            long meetingId = Long.parseLong(aesEncryptionUtil.decrypt(encryptedKey));
            List<KeywordStatistics> allKeywordStatistics = meetingService.findAllKeywordStatistics(meetingId);
            List<KeywordStatisticsDTO> allKeywordStatisticsDTO = new ArrayList<>();

            for (int i = 0; i < allKeywordStatistics.size(); i++) {
                KeywordStatistics keywordStatistics = allKeywordStatistics.get(i);
                KeywordStatisticsDTO keywordStatisticsDTO = KeywordStatisticsDTO
                        .builder()
                        .keyword(keywordStatistics.getKeyword())
                        .percent(keywordStatistics.getPercent())
                        .build();
                allKeywordStatisticsDTO.add(keywordStatisticsDTO);
            }
            response.put("statistics", allKeywordStatisticsDTO);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return new ResponseEntity<>(response, httpStatus);
    }

    @GetMapping("/summary/{encryptedKey}")
    public ResponseEntity<Map<String, Object>> meetingSummary(
            @RequestHeader("Authorization") String token,
            @PathVariable String encryptedKey
    ) {
        long meetingId = Long.parseLong(aesEncryptionUtil.decrypt(encryptedKey));
        Map<String, Object> response = new HashMap<>();
        HttpStatus httpStatus = HttpStatus.OK;
        try {
            String summary = statisticsService.getSummary(meetingId);
            response.put("statistics", summary);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return new ResponseEntity<>(response, httpStatus);
    }

    @PostMapping("/audiomessage/update")
    public ResponseEntity<Map<String, Object>> audioMessageUpdate(
            @RequestHeader("Authorization") String token,
            @RequestBody RequestUpdateAudioMessageDto requestUpdateAudioMessageDto
    ) {

        Map<String, Object> response = new HashMap<>();
        HttpStatus httpStatus = HttpStatus.OK;
        try {
            long audioMessageId = requestUpdateAudioMessageDto.getAudioMessageId();
            String changedContent = requestUpdateAudioMessageDto.getContent();

            audioService.updateByAudioMessageId(audioMessageId,changedContent);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return new ResponseEntity<>(response, httpStatus);
    }
}