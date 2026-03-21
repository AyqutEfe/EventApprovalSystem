package tr.edu.trakya.kycuby.eventapproval.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import tr.edu.trakya.kycuby.eventapproval.dto.PetitionRequest;
import tr.edu.trakya.kycuby.eventapproval.dto.PetitionResponse;
import tr.edu.trakya.kycuby.eventapproval.exception.ResourceNotFoundException;
import tr.edu.trakya.kycuby.eventapproval.service.PetitionService;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/petitions")
@RequiredArgsConstructor
public class PetitionController {

    private final PetitionService petitionService;

    /**
     * Yeni dilekçe oluşturur (Sadece PRESIDENT).
     */
    @PostMapping
    @PreAuthorize("hasRole('PRESIDENT')")
    public ResponseEntity<PetitionResponse> createPetition(
            @Valid @RequestBody PetitionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        PetitionResponse response = petitionService.createPetition(request, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    /**
     * Takvim görünümü için tüm aktif dilekçeleri listeler (REJECTED hariç).
     * Tüm authenticated kullanıcılar erişebilir.
     */
    @GetMapping("/calendar")
    public ResponseEntity<List<PetitionResponse>> getCalendarPetitions() {
        List<PetitionResponse> petitions = petitionService.getCalendarPetitions();
        return ResponseEntity.ok(petitions);
    }

    /**
     * Giriş yapan kullanıcının kendi dilekçelerini listeler.
     */
    @GetMapping("/me")
    public ResponseEntity<List<PetitionResponse>> getMyPetitions(
            @AuthenticationPrincipal UserDetails userDetails) {

        List<PetitionResponse> petitions = petitionService.getMyPetitions(userDetails.getUsername());
        return ResponseEntity.ok(petitions);
    }

    /**
     * Belirli bir dilekçeyi ID ile getirir.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PetitionResponse> getPetitionById(@PathVariable Long id) {
        PetitionResponse response = petitionService.getPetitionById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Dilekçeye ait Word belgesini indirir.
     */
    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) {
        PetitionResponse petition = petitionService.getPetitionById(id);

        if (petition.filePath() == null || petition.filePath().isEmpty()) {
            throw new ResourceNotFoundException("Bu dilekçe için belge bulunamadı");
        }

        try {
            Path filePath = Paths.get(petition.filePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                throw new ResourceNotFoundException("Belge dosyası bulunamadı: " + petition.filePath());
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + filePath.getFileName().toString() + "\"")
                    .body(resource);

        } catch (MalformedURLException e) {
            throw new ResourceNotFoundException("Dosya yolu geçersiz: " + petition.filePath());
        }
    }
}
