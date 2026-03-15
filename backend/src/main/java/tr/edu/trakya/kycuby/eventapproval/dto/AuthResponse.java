package tr.edu.trakya.kycuby.eventapproval.dto;

public record AuthResponse(
        String token,
        String username,
        String role
) {}
