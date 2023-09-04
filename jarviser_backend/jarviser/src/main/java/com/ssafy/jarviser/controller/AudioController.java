package com.ssafy.jarviser.controller;

import com.ssafy.jarviser.domain.AudioMessage;
import com.ssafy.jarviser.exception.ClientException;
import com.ssafy.jarviser.exception.ServerException;
import com.ssafy.jarviser.repository.AudioMessageRepository;
import com.ssafy.jarviser.security.JwtService;
import com.ssafy.jarviser.service.AudioService;
import com.ssafy.jarviser.service.MeetingService;
import com.ssafy.jarviser.service.StatisticsService;
import com.ssafy.jarviser.util.AESEncryptionUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"*"})
@RequestMapping("audio")
public class AudioController {
    private final JwtService jwtService;
    private final AudioService audioService;
    private final StatisticsService statisticsService;
    private final AESEncryptionUtil aesEncryptionUtil;
    private final SimpMessagingTemplate messagingTemplate;

    private final HashMap<String, String> connectCheckMap = new HashMap<>(); //TODO: 추후 DB에 저장 필요 여부 확인
    private final HashMap<Long, String> userSessionMap = new HashMap<>(); //

    @PostMapping(value = "/transcript", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> transcript(
            @RequestHeader("Authorization") String token,
            @RequestParam("file") MultipartFile audioFile,
            String meetingId){

        Map<String, String> resultMap = new HashMap<>();
        Date arriveDate = new Date();

        try{
            String mId = aesEncryptionUtil.decrypt(meetingId);

            token = token.split(" ")[1]; //TODO:에러 처리 필요 여부 확인
            Long userId = jwtService.extractUserId(token); //TODO:에러 처리 필요 여부 확인
            String userName = jwtService.extractUserName(token); //TODO: 에러 처리 필요 여부 확인

            Long startTime = arriveDate.getTime() /*- audioService.getTimeOfAudio(audioFile)*/; //TODO: 추후 정렬에 사용 예정, 현재 DB에만 저장
            String filePath = audioService.saveAudioFile(mId, userId, startTime, audioFile);
            String stt = audioService.getStt(filePath);
            if(stt.equals("")){
                resultMap.put("message", "발화 내용이 없습니다");
                audioService.removeAudioFile(filePath);
                return new ResponseEntity<>(resultMap, HttpStatus.OK);
            }
            String audioMessageId = audioService.createAudioMessage(userId, mId, startTime, filePath, stt).toString();

            resultMap.put("type", "stt");
            resultMap.put("sttId", audioMessageId);
            resultMap.put("userId", userId.toString());
            resultMap.put("userName", userName);
            resultMap.put("content", stt);

            messagingTemplate.convertAndSend("/topic/" + meetingId, resultMap);
            statisticsService.accumulateTranscript(Long.parseLong(mId), stt);

        }catch (ClientException e){
            log.error("request error", e);
            resultMap.put("message", e.getMessage());
            return new ResponseEntity<>(resultMap, HttpStatus.BAD_REQUEST);
        }catch (ServerException e){
            log.error("server error", e);
            resultMap.put("message", e.getMessage());
            return new ResponseEntity<>(resultMap, HttpStatus.INTERNAL_SERVER_ERROR);
        }catch (Exception e){ //TODO:일부 에러 처리 확인이 안된 애들을 위한 임시 처리이므로 추후 수정 필요
            log.error("error", e);
            resultMap.put("message", e.getMessage());
            return new ResponseEntity<>(resultMap, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }


    //TODO:구현 필요
    @GetMapping(value = "/download")
    public ResponseEntity<Map<String, String>> download(
            @RequestHeader("Authorization") String token,
            String meetingId,
            String audioMessageId){

        Map<String, String> resultMap = new HashMap<>();
        //TODO:미팅 참여자가 요청한 것이 맞는 지 확인

        //TODO:오디오메시지가 존재하는 지 확인

        //TODO:오디오 메시지를 가져와서 http로 응답하기
        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }
}