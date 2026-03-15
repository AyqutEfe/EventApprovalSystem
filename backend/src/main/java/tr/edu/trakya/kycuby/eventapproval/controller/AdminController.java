package tr.edu.trakya.kycuby.eventapproval.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import tr.edu.trakya.kycuby.eventapproval.dto.PetitionResponse;
import tr.edu.trakya.kycuby.eventapproval.dto.UserResponse;
import tr.edu.trakya.kycuby.eventapproval.service.PetitionService;
import tr.edu.trakya.kycuby.eventapproval.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final PetitionService petitionService;
    private final UserService userService;

    /**
     * Tüm kullanıcıları listeler (kulüp yönetimi için).
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /**
     * Admin onayı bekleyen dilekçeleri listeler.
     */
    @GetMapping("/petitions")
    public ResponseEntity<List<PetitionResponse>> getPendingPetitions() {
        List<PetitionResponse> petitions = petitionService.getPetitionsForAdmin();
        return ResponseEntity.ok(petitions);
    }

    /**
     * Tüm dilekçeleri listeler (yönetim paneli).
     */
    @GetMapping("/petitions/all")
    public ResponseEntity<List<PetitionResponse>> getAllPetitions() {
        List<PetitionResponse> petitions = petitionService.getAllPetitions();
        return ResponseEntity.ok(petitions);
    }

    /**
     * Dilekçeyi final onaylar: PENDING_ADMIN → APPROVED
     * Takvim çakışması kontrolü yapılır.
     */
    @PutMapping("/petitions/{id}/approve")
    public ResponseEntity<PetitionResponse> approvePetition(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        PetitionResponse response = petitionService.approveByAdmin(id, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    /**
     * Dilekçeyi reddeder.
     */
    @PutMapping("/petitions/{id}/reject")
    public ResponseEntity<PetitionResponse> rejectPetition(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        PetitionResponse response = petitionService.reject(id, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }
}
