
package com.ssafy.jarviser.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Table(name = "report")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"meeting"})
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private long id;

    @Column(name = "summary",length = 5000)
    private String summary;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meeting_id" , foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Meeting meeting;

}

