package com.ssafy.jarviser.repository;

import com.ssafy.jarviser.domain.Participant;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

@Repository
public class ParticipantRepositoryImp implements ParticipantRepository{
    @PersistenceContext
    private EntityManager em;
    @Override
    public void joinParticipant(Participant participant) {
        em.persist(participant);
    }

    @Override
    public Participant findParticipant(long meetingId, long userId) {

        try {
            return em.createQuery(
                            "SELECT p " +
                                    "FROM Participant p " +
                                    "WHERE p.meeting.id = :meetingId AND p.user.id = :userId ",
                            Participant.class
                    )
                    .setParameter("meetingId", meetingId)
                    .setParameter("userId", userId)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null; // 결과가 없으면 null 반환
        }
    }
}
