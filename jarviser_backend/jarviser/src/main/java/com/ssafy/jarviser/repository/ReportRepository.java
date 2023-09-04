package com.ssafy.jarviser.repository;

import com.ssafy.jarviser.domain.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    Report getReportByMeetingId(Long meetingId);
}
