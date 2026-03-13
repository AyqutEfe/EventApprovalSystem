package tr.edu.trakya.tubit.eventapproval.dto;

public record ClubResponse(
        Long id,
        String name,
        String advisorUsername,
        String presidentUsername
) {}
