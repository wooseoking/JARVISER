package com.ssafy.jarviser.repository;

import com.ssafy.jarviser.domain.ParticipantStatistics;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParticipantStatisticsRepository extends JpaRepository<ParticipantStatistics,Long> {
    List<ParticipantStatistics> findAllByMeetingId(long meetingId);
}
