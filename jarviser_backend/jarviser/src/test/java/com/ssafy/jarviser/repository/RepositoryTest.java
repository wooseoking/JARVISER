package com.ssafy.jarviser.repository;

import com.ssafy.jarviser.domain.*;
import com.ssafy.jarviser.service.UserService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;

import java.time.LocalDateTime;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class RepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ReservatedMeetingRepository reservatedMeetingRepository;

    @Autowired
    private UserService userService;

    @Transactional
    @Rollback(value = false)
    @Test
    @BeforeAll //이 테스트를 직접 실행하면 beforeall 어노테이션때문에 두번 실행됨
    public void insertDummyData() throws Exception {
        System.out.println("insertDummyData");
        User user = User.builder()
                .email("user@test.com")
                .password("password")
                .name("User")
                .role(Role.USER)
                .build();
        userRepository.save(user);

        ReservatedMeeting meeting = ReservatedMeeting.builder()
                .meetingName("Meeting")
                .hostId(user.getId())
                .startTime(LocalDateTime.now().plusDays(1))
                .build();
        reservatedMeetingRepository.save(meeting);

        for (int i = 10; i <= 20; i++) {
            ReservatedMeeting meeting1 = ReservatedMeeting.builder()
                    .meetingName("Meeting" + i)
                    .hostId(user.getId())
                    .startTime(LocalDateTime.now().plusDays(1))
                    .build();

            reservatedMeetingRepository.save(meeting1);
            Reservation reservation = new Reservation();
            reservation.setReservation(user, meeting1);
            reservationRepository.save(reservation);
        }

        for (int i = 10; i <= 20; i++) {
            user = User.builder()
                    .email("user" + i + "@test.com")
                    .password("password" + i)
                    .name("User" + i)
                    .role(Role.USER)
                    .build();
            userRepository.save(user);

            Reservation reservation = new Reservation();
            reservation.setReservation(user, meeting);
            reservationRepository.save(reservation);
        }
    }
}
