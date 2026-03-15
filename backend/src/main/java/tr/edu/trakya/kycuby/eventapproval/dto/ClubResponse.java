package tr.edu.trakya.kycuby.eventapproval.dto;

public record ClubResponse(
        Long id,
        String name,
        String advisorUsername,
        String presidentUsername
) {}
