package tr.edu.trakya.tubit.eventapproval.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;
import tr.edu.trakya.tubit.eventapproval.dto.AuthResponse;
import tr.edu.trakya.tubit.eventapproval.dto.LoginRequest;
import tr.edu.trakya.tubit.eventapproval.dto.RegisterRequest;
import tr.edu.trakya.tubit.eventapproval.dto.UserResponse;
import tr.edu.trakya.tubit.eventapproval.security.JwtTokenProvider;
import tr.edu.trakya.tubit.eventapproval.service.UserService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        String token = tokenProvider.generateToken(authentication);
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_PRESIDENT")
                .replace("ROLE_", "");

        return ResponseEntity.ok(new AuthResponse(token, request.username(), role));
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse userResponse = userService.register(request);
        return ResponseEntity.ok(userResponse);
    }
}
