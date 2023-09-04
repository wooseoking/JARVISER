package com.ssafy.jarviser.service;

import com.ssafy.jarviser.domain.ReservatedMeeting;
import com.ssafy.jarviser.domain.Reservation;
import com.ssafy.jarviser.domain.Role;
import com.ssafy.jarviser.domain.User;
import com.ssafy.jarviser.repository.RepositoryTest;
import com.ssafy.jarviser.repository.ReservationRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@Slf4j
public class ReservationTest extends RepositoryTest {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private ReservationRepository reservationRepository;

    @Test
    @Transactional
    public void findUsersTest(){
        List<User> users = reservationService.getUsersFromReservatedMeeting(1L);
        assertNotNull(users);
        log.info(users.toString());
    }

    @Test
    @Transactional
    public void findMeetingsTest(){
        List<ReservatedMeeting> meetings = reservationService.getReservatedMeetings(1L);
        assertNotNull(meetings);
        log.info(meetings.toString());
    }

    @Test
    public void reservationTest(){
        List<String> userEmails = new ArrayList<>();
        userEmails.add("user10@test.com");
        userEmails.add("user11@test.com");
        userEmails.add("user12@test.com");

        ReservatedMeeting meeting = ReservatedMeeting.builder()
                .meetingName("Meeting")
                .startTime(LocalDateTime.now().plusDays(1))
                .build();


        reservationService.createReservation(meeting, userEmails);
        List<User> users = reservationService.getUsersFromReservatedMeeting(1L);
        assertNotNull(users);
    }

    @Test
    public void deleteReservationTest(){
        log.info("deleteReservationTest : delete 전");
        log.info(reservationRepository.findAll().toString());
        reservationService.deleteReservation(1L);
        log.info(reservationRepository.findAll().toString());
        log.info("deleteReservationTest : delete 후");
    }

    @Test
    public void updateReservationTest(){
        List<String> userEmails = new ArrayList<>();
        userEmails.add("user10@test.com");
        userEmails.add("user11@test.com");
        userEmails.add("user12@test.com");
        ReservatedMeeting meeting = ReservatedMeeting.builder()
                .id(1L)
                .meetingName("Meeting")
                .startTime(LocalDateTime.now().plusDays(1))
                .build();

        log.info("deleteReservationTest : update 전");
        log.info(reservationRepository.findAll().toString());
        reservationService.updateReservation(meeting, userEmails);
        log.info(reservationRepository.findAll().toString());
        log.info("deleteReservationTest : update 후");
    }
}
