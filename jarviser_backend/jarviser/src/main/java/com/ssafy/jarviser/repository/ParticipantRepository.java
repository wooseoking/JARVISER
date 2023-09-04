package com.ssafy.jarviser.repository;

import com.ssafy.jarviser.domain.Participant;

public interface ParticipantRepository {
    //참여자 등록
    void joinParticipant(Participant participant);

    Participant findParticipant(long meetingId,long userId);
}
