package com.ssafy.jarviser.domain;

import java.time.LocalDateTime;
import java.util.Date;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Table(name = "audio_message")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"meeting"})
public class AudioMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "audio_message_id")
    private long id;

    @Column(name = "content", length = 2000)
    private String content;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "file_path")
    private String filePath;

    @Column(name = "speech_length")
    private int speechLength;

    @Column(name = "priority")
    private long priority;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id",foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meeting_id" , foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Meeting meeting;

}
