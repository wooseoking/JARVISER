package com.ssafy.jarviser.controller;

import com.ssafy.jarviser.domain.ReservatedMeeting;
import com.ssafy.jarviser.dto.ReservatedMeetingDto;
import com.ssafy.jarviser.dto.ReserveWrapperDto;
import com.ssafy.jarviser.dto.ResponseReservatedMeetingDto;
import com.ssafy.jarviser.security.JwtService;
import com.ssafy.jarviser.service.ReservationService;
import com.ssafy.jarviser.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
@RequestMapping("reservation")
public class ReservationController {

    private final JwtService jwtService;
    private final ReservationService reservationService;
    private final UserService userService;


    @PostMapping("")
    public ResponseEntity<Map<String,Object>> reservate(
            @RequestHeader("Authorization") String token,
            @RequestBody ReserveWrapperDto reserveWrapperDto
    ){
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = null;

        try{
            List<String> emails = reserveWrapperDto.getEmails();
            ReservatedMeetingDto reservatatedMeetingDto = reserveWrapperDto.getReservatedMeetingDto();
            log.info(token);
            token = token.substring(7);
            Long hostId = jwtService.extractUserId(token);

            ReservatedMeeting reservatedMeeting = ReservatedMeeting.builder()
                    .meetingName(reservatatedMeetingDto.getMeetingName())
                    .hostId(hostId)
                    .startTime(reservatatedMeetingDto.getStartTime())
                    .description(reservatatedMeetingDto.getDescription())
                    .build();

            reservationService.createReservation(reservatedMeeting, emails);
            resultMap.put("message", "success");
            status = HttpStatus.ACCEPTED;
        }catch (Exception e){
            log.error("예약 실패 : {}", e);
            resultMap.put("message", "fail");
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(resultMap, status);
    }

    @GetMapping("")
    public ResponseEntity<Map<String, Object>> getReservationList(
            @RequestHeader("Authorization") String token) {
        log.info("Received token: {}", token);
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = null;
        token = token.split(" ")[1];
        try {
            Long userId = jwtService.extractUserId(token);
            List<ReservatedMeeting> meetings = reservationService.getReservatedMeetings(userId);
            List<ResponseReservatedMeetingDto> response = meetings.stream()
                                        .map(ResponseReservatedMeetingDto::new)
                                        .collect(Collectors.toList());
            resultMap.put("reservatedMeetings", response);
            status = HttpStatus.ACCEPTED;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return new ResponseEntity<>(resultMap, status);
    }

    @GetMapping("{reservatedMeetingId}")
    public ResponseEntity<Map<String, Object>> getReservationDetail(@PathVariable Long reservatedMeetingId) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = null;
        try {
            ResponseReservatedMeetingDto reservatedMeetingDto =
                    reservationService.getReservatedMeetingDetail(reservatedMeetingId);
            resultMap.put("reservatedMeeting", reservatedMeetingDto);
            status = HttpStatus.OK;
        } catch (EntityNotFoundException e) {
            resultMap.put("message", "해당 ID로 예약된 미팅을 찾을 수 없습니다.");
            status = HttpStatus.NOT_FOUND;
        } catch (Exception e) {
            resultMap.put("message", "서버 내부 오류");
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<>(resultMap, status);
    }

    @PutMapping("")
    public ResponseEntity<Map<String, Object>> changeReservation(
            @RequestHeader("Authorization") String token) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = null;
        token = token.split(" ")[1];
        try {
            Long userId = jwtService.extractUserId(token);
            List<ReservatedMeeting> meetings = reservationService.getReservatedMeetings(userId);
            List<ResponseReservatedMeetingDto> response = meetings.stream()
                    .map(ResponseReservatedMeetingDto::new)
                    .collect(Collectors.toList());
            resultMap.put("reservatedMeetings", response);
            status = HttpStatus.ACCEPTED;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return new ResponseEntity<>(resultMap, status);
    }

    //회원탈퇴
    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, Object>> delete(
            @RequestHeader("Authorization") String token
    ) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = null;
        token = token.split(" ")[1];
        Long userid = jwtService.extractUserId(token);
        try {
            userService.withdrawal(userid);
            status = HttpStatus.ACCEPTED;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return new ResponseEntity<>(resultMap, status);
    }
}
