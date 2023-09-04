package com.ssafy.jarviser.repository;

import com.ssafy.jarviser.domain.AudioMessage;
import com.ssafy.jarviser.domain.Meeting;
import com.ssafy.jarviser.domain.Report;
import com.ssafy.jarviser.domain.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class MeetingRepositoryImp implements MeetingRepository{

    @PersistenceContext
    private EntityManager em;

    @Override
    public void saveMeeting(Meeting meeting) {
        em.persist(meeting);
    }

    @Override
    public Meeting findMeetingById(long meetingId) {
        return em.find(Meeting.class,meetingId);
    }

    @Override
    public Report findMeetingReportByMeetingId(long meetingId) {
        return em.createQuery(
                "SELECT r " +
                        "FROM Report r " +
                        "WHERE r.id = :meetingId ",Report.class
        )
                .setParameter("meetingId",meetingId)
                .getSingleResult();
    }

//    @Override
//    public List<AudioMessage> findAllAudioMessageByMeetingId(long meetingId) {
//        return em.createQuery(
//                "SELECT am " +
//                        "FROM AudioMessage am "+
//                        "WHERE am.meeting.id = :meetingId"
//        , AudioMessage.class)
//                .setParameter("meetingId",meetingId)
//                .getResultList()
//                ;
//    }

    @Override
    public List<Meeting> findAllMeetingByUserId(long userid) {

        return em.createQuery(
                        "SELECT meeting FROM Participant p " +
                                "WHERE p.user.id = :userid ", Meeting.class)
                .setParameter("userid", userid)
                .getResultList();
    }

    @Override
    public List<User> findUserListByMeetingId(long meetingId) {

        return em.createQuery(
                "SELECT u " +
                        "FROM User u " +
                        "JOIN u.participants p " +
                        "JOIN p.meeting m " +
                        "WHERE m.id = :meetingId", User.class
        )
                .setParameter("meetingId",meetingId)
                .getResultList();
    }
}
