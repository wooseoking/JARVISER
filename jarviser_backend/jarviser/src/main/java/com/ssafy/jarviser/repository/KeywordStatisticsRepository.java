package com.ssafy.jarviser.repository;

import com.ssafy.jarviser.domain.KeywordStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KeywordStatisticsRepository extends JpaRepository<KeywordStatistics,Long> {
    List<KeywordStatistics> findAllByMeetingId(Long meetingId);
}
