package com.ssafy.jarviser.dto;

import com.ssafy.jarviser.domain.ReservatedMeeting;
import com.ssafy.jarviser.domain.User;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ResponseReservatedMeetingDto {
    private long id;
    private String meetingName;
    private long hostId;
    private LocalDateTime startTime;
    private String description;
    private List<User> userEmailList;

    // Constructor that accepts a ReservatedMeeting entity and initializes the fields
    public ResponseReservatedMeetingDto(ReservatedMeeting meeting) {
        this.id = meeting.getId();
        this.meetingName = meeting.getMeetingName();
        this.hostId = meeting.getHostId();
        this.startTime = meeting.getStartTime();
        this.description = meeting.getDescription();
    }
}
