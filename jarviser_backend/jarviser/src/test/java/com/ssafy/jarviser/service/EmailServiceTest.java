package com.ssafy.jarviser.service;

import com.ssafy.jarviser.domain.ReservatedMeeting;
import com.ssafy.jarviser.domain.Reservation;
import com.ssafy.jarviser.domain.Role;
import com.ssafy.jarviser.domain.User;
import com.ssafy.jarviser.repository.ReservatedMeetingRepository;
import com.ssafy.jarviser.repository.ReservationRepository;
import com.ssafy.jarviser.repository.UserRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;
import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@SpringBootTest
class EmailServiceTest {

    @Autowired
    EmailService emailService;

    @Autowired
    ReservatedMeetingRepository reservatedMeetingRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ReservationRepository reservationRepository;
    @BeforeEach
    void set(){
        User user1 = User.builder()
                .email("taehyun0121@naver.com")
                .password("password")
                .name("User")
                .role(Role.USER)
                .build();
        userRepository.save(user1);

        User user2 = User.builder()
                .email("ansghddnd12@naver.com")
                .password("password")
                .name("User")
                .role(Role.USER)
                .build();
        userRepository.save(user2);

        ReservatedMeeting meeting = ReservatedMeeting.builder()
                .meetingName("test")
                .hostId(user1.getId())
                .description("인생은 한방이다 - copilot")
                .startTime(LocalDateTime.now().plusMinutes(10))
                .build();
        reservatedMeetingRepository.save(meeting);

        Reservation reservation1 = new Reservation();
        reservation1.setReservation(user1, meeting);
        reservationRepository.save(reservation1);

        Reservation reservation2 = new Reservation();
        reservation2.setReservation(user2, meeting);
        reservationRepository.save(reservation2);

    }

    @Test
    @DisplayName("회원 가입 테스팅")
    void testEmailSend(){
        ReservatedMeeting reservatedMeeting = reservatedMeetingRepository.findById(1L).get();
        emailService.setMailContent(reservatedMeeting);
    }
}