package tr.edu.trakya.tubit.eventapproval.dto;

public record AuthResponse(
        String token,
        String username,
        String role
) {}
