package com.ssafy.jarviser.service;

import com.ssafy.jarviser.domain.Report;
import com.ssafy.jarviser.repository.ReportRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class RepositoryServiceImp implements RepositoryService{

    private final ReportRepository reportRepository;

    @Override
    public long saveSummary(Report report) {
        Report savedReport = reportRepository.save(report);
        return savedReport.getId();
    }
}
