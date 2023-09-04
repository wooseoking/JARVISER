package com.ssafy.jarviser.service;

import com.ssafy.jarviser.domain.*;
import com.ssafy.jarviser.dto.KeywordStatisticsDTO;
import com.ssafy.jarviser.dto.ParticipantsStaticsDTO;

import java.util.List;
import java.util.Map;

public interface MeetingService{
    //미팅 생성 (반환값 : 암호화된 미팅 PK)
    String createMeeting(Long hostId, String meetingName);

    //미팅 참여자 등록
    void joinMeeting(Long joinUserId, long meetingId);

    //미팅 아이디로 미팅 조회
    Meeting findMeetingById(long meetingId);

    //미팅 아이디로 미팅 참여자들 조회
    List<User> findUserListByMeetingId(long meetingId);

    //유저아이디로 미팅참여 보기
    List<Meeting> findMeetingListByUserId(long userid);

    //미팅 - 오디오메시지 저장
    void addAudioMessageToMeeting(long meetingId, AudioMessage audioMessage);

    //미팅 - 키워드 저장
    void addKeywordStatisticsToMeeting(long meetingId, List<KeywordStatistics> keywordStatistics);

    //미팅 - 발화자 통계 저장
    void addParticipantsStatisticsToMeeting(long meetingId,List<ParticipantStatistics> participantStatistics);

    //미팅 - 리포트 저장
    void addReport(long meetingId,Report report);
    //미팅 아이디로 오디오 메시지 불러오기
    List<AudioMessage> findAllAudioMessage(long meetingId);

    //미팅 아이디로 키워드 불러오기
    List<KeywordStatistics> findAllKeywordStatistics(long meetingId);

    //미팅 아이디로 발화자 통계 불러오기
    List<ParticipantStatistics> findAllParticipantStatistics(long meetingId);

    //미팅 - 키워드  이용하여 키워드별 통계 계산
    List<KeywordStatistics> caculateKeywordsStatics(long meetingId);

    //미팅 - 참여자  이용하여 발화자 통계 계산
    List<ParticipantStatistics> caculateParticipantsStatics(long meetingId);

}