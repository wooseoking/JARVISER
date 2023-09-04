package com.ssafy.jarviser.service;

import com.ssafy.jarviser.domain.ReservatedMeeting;
import com.ssafy.jarviser.domain.Reservation;
import com.ssafy.jarviser.domain.User;
import com.ssafy.jarviser.dto.ResponseReservatedMeetingDto;
import com.ssafy.jarviser.repository.ReservatedMeetingRepository;
import com.ssafy.jarviser.repository.ReservationRepository;
import com.ssafy.jarviser.repository.ReservationRepositoryCustom;
import com.ssafy.jarviser.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final ReservationRepositoryCustom reservationRepositoryCustom;
    private final ReservatedMeetingRepository reservatedMeetingRepository;
    private final UserRepository userRepository;

    @Transactional
    public void createReservation(ReservatedMeeting reservatedMeeting, List<String> userEmails) {
        log.debug(reservatedMeeting.toString()); // 얘 읽는데 10초
        reservatedMeetingRepository.save(reservatedMeeting);

        for (String userEmail : userEmails) {
            User user = userRepository.findByEmail(userEmail);
            Reservation reservation = new Reservation();
            reservation.setReservation(user, reservatedMeeting);
            reservationRepository.save(reservation);
        }
    }

    @Transactional
    public List<User> getUsersFromReservatedMeeting(Long reservatedMeetingId) {
        List<User> users = reservationRepositoryCustom.getUsersFromMeetingRoom(reservatedMeetingId);
        return users;
    }

    @Transactional
    public List<ReservatedMeeting> getReservatedMeetings(Long userId) {
        List<ReservatedMeeting> reservatedMeetings = reservationRepositoryCustom.getMeetingsFromUser(userId);
        return reservatedMeetings;
    }

    @Transactional
    public ResponseReservatedMeetingDto getReservatedMeetingDetail(Long reservatedMeetingId){
        Optional<ReservatedMeeting> optionalReservatedMeeting = reservatedMeetingRepository.findById(reservatedMeetingId);
        ReservatedMeeting reservatedMeeting =
                optionalReservatedMeeting.orElseThrow(() -> new EntityNotFoundException("해당 ID로 예약된 미팅을 찾을 수 없습니다."));

        List<User> users = reservationRepositoryCustom.getUsersFromMeetingRoom(reservatedMeetingId);

        ResponseReservatedMeetingDto reservatedMeetingDto = new ResponseReservatedMeetingDto(reservatedMeeting);
        reservatedMeetingDto.setUserEmailList(users);
        return reservatedMeetingDto;
    }

    @Transactional
    public void updateReservation(ReservatedMeeting reservatedMeeting, List<String> userEmails) {
        log.debug(reservatedMeeting.toString());
        reservatedMeetingRepository.save(reservatedMeeting); //save시 이미 있으면 update

        List<Reservation> reservations = reservationRepository.findAllByReservatedMeetingId(reservatedMeeting.getId());
        reservationRepository.deleteAllInBatch(reservations); //delete문이 하나씩 실행되는게 아니라 delete하나에 모두 제거

        for (String email : userEmails) {
            User user = userRepository.findByEmail(email);
            Reservation reservation = new Reservation();
            reservation.setReservation(user, reservatedMeeting);
            reservationRepository.save(reservation);
        }
    }

    @Transactional
    public void deleteReservation(Long reservatedMeetingId) {
        List<Reservation> reservations = reservationRepository.findAllByReservatedMeetingId(reservatedMeetingId);
        reservationRepository.deleteAllInBatch(reservations); //select하는 과정은 없고 해오지 않고 오로직 delete만 한다.
        reservatedMeetingRepository.deleteById(reservatedMeetingId);
    }
}
