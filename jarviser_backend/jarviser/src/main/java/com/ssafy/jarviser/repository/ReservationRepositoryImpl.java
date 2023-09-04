package com.ssafy.jarviser.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.jarviser.domain.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class ReservationRepositoryImpl implements ReservationRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public List<User> getUsersFromMeetingRoom(Long id) {
        QReservation reservation = QReservation.reservation;
        QUser user = QUser.user;

        return queryFactory
                .select(user)
                .from(reservation)
                .join(reservation.user, user)
                .where(reservation.reservatedMeeting.id.eq(id))
                .fetch();
    }

    @Override
    public List<ReservatedMeeting> getMeetingsFromUser(Long userId) {
        QReservatedMeeting reservatedMeeting = QReservatedMeeting.reservatedMeeting;
        QReservation reservation = QReservation.reservation;

        return queryFactory
                .select(reservation.reservatedMeeting)
                .from(reservation)
                .join(reservation.reservatedMeeting, reservatedMeeting)
                .where(reservation.user.id.eq(userId))
                .fetch();
    }
}
