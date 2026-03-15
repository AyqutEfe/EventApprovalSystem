package tr.edu.trakya.kycuby.eventapproval.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tr.edu.trakya.kycuby.eventapproval.dto.ClubRequest;
import tr.edu.trakya.kycuby.eventapproval.dto.ClubResponse;
import tr.edu.trakya.kycuby.eventapproval.service.ClubService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/clubs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ClubController {

    private final ClubService clubService;

    @GetMapping
    public ResponseEntity<List<ClubResponse>> getAllClubs() {
        return ResponseEntity.ok(clubService.getAllClubs());
    }

    @PostMapping
    public ResponseEntity<ClubResponse> createClub(@Valid @RequestBody ClubRequest request) {
        ClubResponse response = clubService.createClub(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
