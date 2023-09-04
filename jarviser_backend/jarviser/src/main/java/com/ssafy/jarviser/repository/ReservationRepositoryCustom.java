package com.ssafy.jarviser.repository;

import com.ssafy.jarviser.domain.ReservatedMeeting;
import com.ssafy.jarviser.domain.User;

import java.util.List;

public interface ReservationRepositoryCustom {
    List<User> getUsersFromMeetingRoom(Long meetingId);
    List<ReservatedMeeting> getMeetingsFromUser(Long userId);
}
