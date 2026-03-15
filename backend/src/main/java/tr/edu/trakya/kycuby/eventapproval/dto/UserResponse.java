package tr.edu.trakya.kycuby.eventapproval.dto;

public record UserResponse(
        Long id,
        String username,
        String email,
        String role
) {}
