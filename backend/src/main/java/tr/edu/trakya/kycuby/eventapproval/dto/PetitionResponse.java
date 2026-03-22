package tr.edu.trakya.kycuby.eventapproval.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record PetitionResponse(
        Long id,
        String eventName,
        LocalDate eventDate,
        String location,
        String description,
        String status,
        String filePath,
        LocalDateTime createdAt,
        String clubName,
        String createdByUsername,
        String rejectionReason
) {}
