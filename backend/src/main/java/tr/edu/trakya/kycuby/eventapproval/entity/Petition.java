package tr.edu.trakya.kycuby.eventapproval.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import tr.edu.trakya.kycuby.eventapproval.entity.enums.PetitionStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "petitions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Petition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_name", nullable = false, length = 200)
    private String eventName;

    @Column(name = "event_start_date", nullable = false)
    private LocalDate eventStartDate;

    @Column(name = "event_end_date", nullable = false)
    private LocalDate eventEndDate;

    @Column(nullable = false, length = 200)
    private String location;

    @Column(name = "event_start_time", nullable = false, length = 50)
    private String eventStartTime;

    @Column(name = "event_end_time", nullable = false, length = 50)
    private String eventEndTime;

    @Column(name = "event_content", columnDefinition = "TEXT", nullable = false)
    private String eventContent;

    @Column(name = "support_info", columnDefinition = "TEXT")
    private String supportInfo;

    @Column(name = "speaker_info", columnDefinition = "TEXT")
    private String speakerInfo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PetitionStatus status;

    @Column(name = "file_path")
    private String filePath;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;
}
