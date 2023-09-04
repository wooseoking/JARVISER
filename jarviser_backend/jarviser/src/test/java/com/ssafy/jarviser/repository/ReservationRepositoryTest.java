package com.ssafy.jarviser.repository;

import com.ssafy.jarviser.domain.ReservatedMeeting;
import com.ssafy.jarviser.domain.User;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class ReservationRepositoryTest extends RepositoryTest{

    @Autowired
    private ReservationRepositoryCustom reservationRepositoryCustom;

    @Test
    @Transactional
    public void findUserTest(){
        List<User> users = reservationRepositoryCustom.getUsersFromMeetingRoom(1L);

        for(User user: users){
            System.out.println(user.getEmail());
        }
    }

    @Test
    @Transactional
    public void findMeetingTest(){
        List<ReservatedMeeting> meetings = reservationRepositoryCustom.getMeetingsFromUser(1L);

        for(ReservatedMeeting meeting: meetings){
            System.out.println(meeting.getMeetingName());
        }
    }
}
