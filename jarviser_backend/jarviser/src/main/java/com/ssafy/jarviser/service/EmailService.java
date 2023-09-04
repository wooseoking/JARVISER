package com.ssafy.jarviser.service;

import com.ssafy.jarviser.domain.ReservatedMeeting;
import com.ssafy.jarviser.domain.Reservation;
import com.ssafy.jarviser.dto.EmailContentDto;
import com.ssafy.jarviser.repository.ReservatedMeetingRepository;
import com.ssafy.jarviser.repository.ReservationRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.Email;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;

    private final ReservatedMeetingRepository reservatedMeetingRepository;

    private final ReservationService reservationService;

    //TODO: 리팩토링할 것
    public void sendEmail(EmailContentDto emailContentDto){
        String title = emailContentDto.getTitle();
        String description = emailContentDto.getDescription();
        String startTime = emailContentDto.getStartTime();
        List<String> emails = emailContentDto.getEmails();

        SimpleMailMessage message = new SimpleMailMessage();
        message.setSubject("안녕하세요, 당신의 비서 Jarviser입니다.");
        message.setTo(emails.toArray(new String[0]));
        message.setText(title + "미팅이" + startTime + "에 시작될 예정입니다. \n\n" + "상세: " + description);

        javaMailSender.send(message);
    }

    // CONSIDER
    //1. 모두 읽어들인 후 비즈니스 로직으로 10분 이내로 남은걸 뽑아낼 것이냐
    //2. 쿼리에서 10분 이내로 남은걸 뽑아낼 것이냐
    @Scheduled(fixedRate = 1200*1000)
    public void checkReservationTask(){
        log.info("--------scheduling-----------");
        LocalDateTime curTime = LocalDateTime.now();
        List<ReservatedMeeting> reservatedMeetings =
                reservatedMeetingRepository.findByStartTimeIsBetween(curTime, curTime.plusMinutes(10));

        reservatedMeetings.forEach(this::handleReservationMail);
    }

    // CONSIDER: 굳이 transactional을 걸어야할까?
    @Transactional
    public void handleReservationMail(ReservatedMeeting reservatedMeeting) {
        EmailContentDto emailContentDto = setMailContent(reservatedMeeting);
        sendEmail(emailContentDto);
        reservationService.deleteReservation(reservatedMeeting.getId());
    }

    public EmailContentDto setMailContent(ReservatedMeeting reservatedMeeting) {
        String title = reservatedMeeting.getMeetingName();
        String description = reservatedMeeting.getDescription();
        String startTime = reservatedMeeting.getStartTime().toString();
        List<Reservation> reservations = reservatedMeeting.getReservations();

        EmailContentDto emailContentDto = EmailContentDto.builder()
                .title(title)
                .description(description)
                .startTime(startTime)
                .emails(reservations.stream()
                        .map(reservation -> reservation.getUser().getEmail())
                        .toList())
                .build();

        return emailContentDto;
    }
}