package com.ssafy.jarviser.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Table(name = "participant_statistics")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ParticipantStatistics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "participant_statistics_id")
    private long id;
    private String name;
    private double percent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meeting_id" , foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Meeting meeting;
}
