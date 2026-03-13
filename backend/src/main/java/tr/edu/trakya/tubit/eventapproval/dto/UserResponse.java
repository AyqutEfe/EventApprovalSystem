package tr.edu.trakya.tubit.eventapproval.dto;

public record UserResponse(
        Long id,
        String username,
        String email,
        String role
) {}
