package tr.edu.trakya.kycuby.eventapproval.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import tr.edu.trakya.kycuby.eventapproval.dto.PetitionResponse;
import tr.edu.trakya.kycuby.eventapproval.service.PetitionService;

import java.util.List;

@RestController
@RequestMapping("/api/advisor")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADVISOR')")
public class AdvisorController {

    private final PetitionService petitionService;

    /**
     * Danışmanın kulübüne ait tüm dilekçeleri listeler.
     */
    @GetMapping("/petitions")
    public ResponseEntity<List<PetitionResponse>> getMyClubPetitions(
            @AuthenticationPrincipal UserDetails userDetails) {

        List<PetitionResponse> petitions = petitionService.getPetitionsForAdvisor(userDetails.getUsername());
        return ResponseEntity.ok(petitions);
    }

    /**
     * Dilekçeyi onaylar: PENDING_ADVISOR → PENDING_ADMIN
     */
    @PutMapping("/petitions/{id}/approve")
    public ResponseEntity<PetitionResponse> approvePetition(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        PetitionResponse response = petitionService.approveByAdvisor(id, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    /**
     * Dilekçeyi reddeder.
     */
    @PutMapping("/petitions/{id}/reject")
    public ResponseEntity<PetitionResponse> rejectPetition(
            @PathVariable Long id,
            @RequestParam(required = false) String reason,
            @AuthenticationPrincipal UserDetails userDetails) {

        PetitionResponse response = petitionService.reject(id, userDetails.getUsername(), reason);
        return ResponseEntity.ok(response);
    }
}
