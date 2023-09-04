package com.ssafy.jarviser.init;

import com.ssafy.jarviser.domain.*;
import com.ssafy.jarviser.dto.KeywordStatisticsDTO;
import com.ssafy.jarviser.dto.ParticipantsStaticsDTO;
import com.ssafy.jarviser.repository.*;
import com.ssafy.jarviser.service.MeetingService;
import com.ssafy.jarviser.service.OpenAIService;
import com.ssafy.jarviser.util.AESEncryptionUtil;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class InsertTestDummy implements CommandLineRunner {


    @Autowired
    UserRepository userRepository;

    @Autowired
    private MeetingService meetingService;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ReservatedMeetingRepository reservatedMeetingRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private OpenAIService openAIService;

    @Autowired
    private AESEncryptionUtil aesEncryptionUtil;

    @Override
    public void run(String... args) throws Exception {
        // 여기에 애플리케이션 시작 시에 실행할 쿼리를 작성하세요.
        User taehyun = User.builder()
                .email("taehyun0121@naver.com")
                .password(passwordEncoder.encode("password"))
                .name("taehyun")
                .role(Role.USER)
                .build();
        userRepository.save(taehyun);

        User hongwoong = User.builder()
                .email("ansghddnd12@naver.com")
                .password(passwordEncoder.encode("password"))
                .name("hongwoong")
                .role(Role.USER)
                .build();
        userRepository.save(hongwoong);

        ReservatedMeeting meeting = ReservatedMeeting.builder()
                .meetingName("test")
                .hostId(taehyun.getId())
                .description("인생은 한방이다 - copilot")
                .startTime(LocalDateTime.now().plusMinutes(10))
                .build();
        reservatedMeetingRepository.save(meeting);

        Reservation reservation1 = new Reservation();
        reservation1.setReservation(taehyun, meeting);
        reservationRepository.save(reservation1);

        Reservation reservation2 = new Reservation();
        reservation2.setReservation(hongwoong, meeting);
        reservationRepository.save(reservation2);


        //회원 가입
        User test = User.builder()
                .email("test@gmail.com")
                .password(passwordEncoder.encode("testtesttest"))
                .name("testtesttest")
                .role(Role.USER)
                .build();

        userRepository.save(test);

        User wooseok = User.builder()
                .email("wooseok777777@gmail.com")
                .password(passwordEncoder.encode("wooseokPassword"))
                .name("ChoiWooSeok")
                .role(Role.USER)
                .build();

        userRepository.save(wooseok);

        User minwoo = User.builder()
                .email("jerry142857@naver.com")
                .password(passwordEncoder.encode("minwooPassword"))
                .name("KimMinWoo")
                .role(Role.USER)
                .build();
        userRepository.save(minwoo);

        User woong = User.builder()
                .email("woongwoong@naver.com")
                .password(passwordEncoder.encode("woongPassword"))
                .name("NaHyunWoong")
                .role(Role.USER)
                .build();
        userRepository.save(woong);

        User changHoon = User.builder()
                .email("ReptileHoon@naver.com")
                .password(passwordEncoder.encode("changhoon"))
                .name("JooChangHoon")
                .role(Role.USER)
                .build();
        userRepository.save(changHoon);

        // 테스트 미팅 생성
        String testMeetingName = "test's Meeting";
        String testMeetingEncrypted = meetingService.createMeeting(test.getId(),testMeetingName);
        long testMeetingId = Long.parseLong(aesEncryptionUtil.decrypt(testMeetingEncrypted));
        Meeting testMeeting = meetingService.findMeetingById(testMeetingId);

        // 우석 미팅 생성
        String wooseokMeetingName = "wooseok's Meeting";
        String wooseokMeetingEncrypted = meetingService.createMeeting(wooseok.getId(),wooseokMeetingName);
        long wooseokMeetingId = Long.parseLong(aesEncryptionUtil.decrypt(wooseokMeetingEncrypted));
        Meeting wooseokMeeting = meetingService.findMeetingById(wooseokMeetingId);

        // 민우 미팅 생성
        String minWooMeetingName = "minwoo's Meeting";
        String minwooMeetingEncrypted = meetingService.createMeeting(minwoo.getId(),minWooMeetingName);
        long minwooMeetingId = Long.parseLong(aesEncryptionUtil.decrypt(minwooMeetingEncrypted));
        Meeting minwooMeeting = meetingService.findMeetingById(minwooMeetingId);

        // 홍웅 미팅 생성
        String hongWoongMeetingName = "hongwoong's Meeting";
        String hongWoongMeetingEncrypted = meetingService.createMeeting(hongwoong.getId(),hongWoongMeetingName);
        long hongWoongMeetingId = Long.parseLong(aesEncryptionUtil.decrypt(hongWoongMeetingEncrypted));
        Meeting hongWoongMeeting = meetingService.findMeetingById(hongWoongMeetingId);

        //테스트 미팅에 우석-민우-홍웅-태현-현웅 참여
        meetingService.joinMeeting(wooseok.getId(),testMeetingId);
        meetingService.joinMeeting(minwoo.getId(),testMeetingId);
        meetingService.joinMeeting(hongwoong.getId(),testMeetingId);
        meetingService.joinMeeting(taehyun.getId(),testMeetingId);
        meetingService.joinMeeting(woong.getId(),testMeetingId);
        //우석미팅에 현웅 - 창훈 - 테스트 참여
        meetingService.joinMeeting(woong.getId(),wooseokMeetingId);
        meetingService.joinMeeting(changHoon.getId(), wooseokMeetingId);
        meetingService.joinMeeting(test.getId(),wooseokMeetingId);

        //민우 미팅에 우석 - 태현 - 홍웅 - 테스트 참여
        meetingService.joinMeeting(wooseok.getId(),minwooMeetingId);
        meetingService.joinMeeting(taehyun.getId(), minwooMeetingId);
        meetingService.joinMeeting(hongwoong.getId(), minwooMeetingId);
        meetingService.joinMeeting(wooseok.getId(),minwooMeetingId);
        meetingService.joinMeeting(test.getId(),minwooMeetingId);

        //홍웅 미팅에 테스트 참여
        meetingService.joinMeeting(test.getId(),hongWoongMeetingId);

        try  {
            Resource dummyResource = new ClassPathResource("meeting_notes.xlsx");
            File file = dummyResource.getFile();
            Workbook workbook = new XSSFWorkbook(file);
            Sheet sheet = workbook.getSheetAt(0);

            for (Row row : sheet) {
                Cell speakerCell = row.getCell(0);
                Cell contentCell = row.getCell(1);

                long userId = (long) speakerCell.getNumericCellValue();
                String content = contentCell != null ? contentCell.getStringCellValue().trim() : "";

                User user = userRepository.findUserById(userId);

                AudioMessage audioMessage = AudioMessage.builder()
                        .user(user)
                        .content(content)
                        .speechLength(content.length())
                        .meeting(testMeeting)
                        .startTime(LocalDateTime.now())
                        .filePath("filePath...")
                        .priority(1)
                        .build();
//
                meetingService.addAudioMessageToMeeting(testMeeting.getId(),audioMessage);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }


        //test meeting audiomessage 출력

        String summary = "**회의 요약**\n" +
                "\n" +
                "**일시:** [회의 일시]\n" +
                "**참석자:** [참석자 목록]\n" +
                "\n" +
                "**안건: 화상회의 서비스 개발 계획 수립**\n" +
                "\n" +
                "**주요 내용:**\n" +
                "\n" +
                "- 실시간 통신과 사용자 인터페이스에 중점을 두는 화상회의 서비스 개발 계획을 논의하였습니다.\n" +
                "- WebRTC 기술을 사용하여 실시간 통신을 구현하고, 사용자 인터페이스는 반응형 디자인으로 구현할 예정입니다.\n" +
                "- 보안을 강조하며, 데이터 암호화 기술의 도입을 검토하기로 하였습니다.\n" +
                "- 다음 회의까지 각자 역할과 준비 사항을 정리해오기로 하였습니다.\n" +
                "- 다음 주에 다시 모여 계획을 점검할 예정입니다.\n" +
                "- 지속적인 팀 내 소통과 업무 공유의 중요성을 강조하였습니다.\n" +
                "- 기술 스택과 도구 선택에 대한 연구가 필요하며, 선정한 것이 목표에 부합하는지 검토할 예정입니다.\n" +
                "- 예산 및 자원 관리를 고려하여 준비해 오기로 하였습니다.\n" +
                "- 품질 보증과 테스트 계획을 세워서 서비스 품질을 확보할 예정입니다.\n" +
                "\n" +
                "**다음 회의 일정:** [다음 회의 일시]\n" +
                "\n" +
                "**회의 요약:** 회의에서는 화상회의 서비스 개발 계획을 논의하였으며, 실시간 통신과 사용자 인터페이스 구조, 보안 및 암호화, 역할 분담 및 준비 사항, 소통 방식, 기술 스택 및 도구 선택, 예산 및 자원 관리, 품질 보증과 테스트 계획 등에 대한 내용을 다루었습니다. 다음 회의까지 각자 역할을 준비하고, 이에 따른 계획을 더욱 구체화해오기로 하였습니다.";

        Report report = Report.builder()
                .meeting(testMeeting)
                .summary(summary)
                .build();

        //test meeting에 report 추가
        testMeeting.addReport(report);

        meetingService.addReport(testMeetingId,report);
    }
}