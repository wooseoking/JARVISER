package com.ssafy.jarviser.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.ssafy.jarviser.dto.ParticipantsStaticsDTO;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "meeting")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"audioMessages", "chatMessages", "report", "participants"})
public class Meeting implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "meeting_id")
    private long id;

    @Column(name = "meeting_name")
    private String meetingName;

    @Column(name = "host_id")
    private long hostId;

    @Column(name = "meeting_url")
    private String meetingUrl;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;
    
    @Column(name = "encryptedKey")
    private String encryptedKey;

    @Column(name = "encryptedKey_hash")
    private int encryptedKeyHash;

    @OneToMany(mappedBy = "meeting")
    private final List<AudioMessage> audioMessages = new ArrayList<>();

    @OneToOne(mappedBy = "meeting")
    private Report report;

    @OneToMany(mappedBy = "meeting")
    private final List<Participant> participants = new ArrayList<>();

    @OneToMany(mappedBy = "meeting")
    private final List<KeywordStatistics> keywordStatistics = new ArrayList<>();

    @OneToMany(mappedBy = "meeting")
    private final List<ParticipantStatistics> participantStatisticsList = new ArrayList<>();

    @Builder
    public Meeting(long id,String meetingName,long hostId,String meetingUrl,LocalDateTime startTime){
        this.id = id;
        this.meetingName = meetingName;
        this.hostId = hostId;
        this.meetingUrl = meetingUrl;
        this.startTime = startTime;
    }

    public void addAudioMessage(AudioMessage audioMessage){
        this.audioMessages.add(audioMessage);
        audioMessage.setMeeting(this);
    }

    public void addKeywordStatistics(KeywordStatistics keywordStatistics){
        this.keywordStatistics.add(keywordStatistics);
        keywordStatistics.setMeeting(this);
    }

    public void addParticipantStatistics(ParticipantStatistics participantStatistics){
        this.participantStatisticsList.add(participantStatistics);
        participantStatistics.setMeeting(this);
    }

    public void addReport(Report report){
        this.report = report;
        report.setMeeting(this);
    }
}

