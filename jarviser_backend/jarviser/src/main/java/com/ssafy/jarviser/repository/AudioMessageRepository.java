package com.ssafy.jarviser.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.jarviser.domain.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AudioMessageRepository extends JpaRepository<AudioMessage,Long> {
    List<AudioMessage> findAllByMeetingId(long meetingId);
    List<AudioMessage> findAllByMeetingIdOrderByPriorityAsc(long meetingId);

}