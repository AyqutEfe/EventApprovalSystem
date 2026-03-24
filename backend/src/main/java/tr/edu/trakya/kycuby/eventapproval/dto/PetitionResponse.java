package tr.edu.trakya.kycuby.eventapproval.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record PetitionResponse(
        Long id,
        String eventName,
        LocalDate eventStartDate,
        LocalDate eventEndDate,
        String location,
        String eventStartTime,
        String eventEndTime,
        String eventContent,
        String supportInfo,
        String speakerInfo,
        String status,
        String filePath,
        LocalDateTime createdAt,
        String clubName,
        String createdByUsername,
        String rejectionReason
) {}
