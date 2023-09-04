package com.ssafy.jarviser.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Table(name = "reservation")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"user","reservatedMeeting"})
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_id")
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservated_meeting_id")
    private ReservatedMeeting reservatedMeeting;

    public void setReservation(User user,ReservatedMeeting reservatedMeeting){
        this.user = user;
        this.reservatedMeeting = reservatedMeeting;

        user.getReservations().add(this);
        reservatedMeeting.getReservations().add(this);
    }
}
