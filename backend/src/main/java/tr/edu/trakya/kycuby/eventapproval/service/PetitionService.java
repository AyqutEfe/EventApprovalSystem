package tr.edu.trakya.kycuby.eventapproval.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tr.edu.trakya.kycuby.eventapproval.dto.PetitionRequest;
import tr.edu.trakya.kycuby.eventapproval.dto.PetitionResponse;
import tr.edu.trakya.kycuby.eventapproval.entity.Club;
import tr.edu.trakya.kycuby.eventapproval.entity.Petition;
import tr.edu.trakya.kycuby.eventapproval.entity.User;
import tr.edu.trakya.kycuby.eventapproval.entity.enums.PetitionStatus;
import tr.edu.trakya.kycuby.eventapproval.entity.enums.Role;
import tr.edu.trakya.kycuby.eventapproval.exception.BusinessException;
import tr.edu.trakya.kycuby.eventapproval.exception.ResourceNotFoundException;
import tr.edu.trakya.kycuby.eventapproval.mapper.PetitionMapper;
import tr.edu.trakya.kycuby.eventapproval.repository.PetitionRepository;

import java.time.LocalDate;
import java.util.List;

/**
 * Dilekçe iş akışını yöneten servis.
 *
 * İş akışı:
 * 1. Başkan → createPetition()     → PENDING_ADVISOR
 * 2. Danışman → approveByAdvisor() → PENDING_ADMIN
 * 3. Admin → approveByAdmin()      → APPROVED
 * Her aşamada reject mümkün        → REJECTED
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PetitionService {

    private final PetitionRepository petitionRepository;
    private final PetitionMapper petitionMapper;
    private final ClubService clubService;
    private final UserService userService;
    private final DocumentService documentService;

    /**
     * Kulüp başkanı yeni bir dilekçe oluşturur.
     * Durum: PENDING_ADVISOR
     */
    @Transactional
    public PetitionResponse createPetition(PetitionRequest request, String username) {
        User president = userService.findByUsername(username);

        if (president.getRole() != Role.PRESIDENT) {
            throw new BusinessException("Sadece kulüp başkanları dilekçe oluşturabilir");
        }

        Club club = clubService.findByPresidentId(president.getId());

        Petition petition = Petition.builder()
                .eventName(request.eventName())
                .eventDate(request.eventDate())
                .location(request.location())
                .description(request.description())
                .status(PetitionStatus.PENDING_ADVISOR)
                .club(club)
                .createdBy(president)
                .build();

        Petition savedPetition = petitionRepository.save(petition);

        // Belge oluştur
        String filePath = documentService.generateDocument(savedPetition, club.getName(), president.getUsername());
        savedPetition.setFilePath(filePath);
        petitionRepository.save(savedPetition);

        log.info("Yeni dilekçe oluşturuldu: id={}, etkinlik={}, kulüp={}",
                savedPetition.getId(), savedPetition.getEventName(), club.getName());

        return petitionMapper.toResponse(savedPetition);
    }

    /**
     * Danışman dilekçeyi onaylar.
     * PENDING_ADVISOR → PENDING_ADMIN
     */
    @Transactional
    public PetitionResponse approveByAdvisor(Long petitionId, String advisorUsername) {
        User advisor = userService.findByUsername(advisorUsername);
        Petition petition = findPetitionById(petitionId);

        validateAdvisorAccess(petition, advisor);

        if (petition.getStatus() != PetitionStatus.PENDING_ADVISOR) {
            throw new BusinessException("Bu dilekçe danışman onayı beklenmiyor. Mevcut durum: " + petition.getStatus());
        }

        petition.setStatus(PetitionStatus.PENDING_ADMIN);
        Petition updated = petitionRepository.save(petition);

        log.info("Dilekçe danışman tarafından onaylandı: id={}, danışman={}", petitionId, advisorUsername);
        return petitionMapper.toResponse(updated);
    }

    /**
     * Admin (Müdür Yardımcısı) dilekçeyi final onaylar.
     * PENDING_ADMIN → APPROVED
     * Takvim çakışması kontrolü yapılır.
     */
    @Transactional
    public PetitionResponse approveByAdmin(Long petitionId, String adminUsername) {
        User admin = userService.findByUsername(adminUsername);

        if (admin.getRole() != Role.ADMIN) {
            throw new BusinessException("Sadece admin kullanıcılar final onay verebilir");
        }

        Petition petition = findPetitionById(petitionId);

        if (petition.getStatus() != PetitionStatus.PENDING_ADMIN) {
            throw new BusinessException("Bu dilekçe admin onayı beklenmiyor. Mevcut durum: " + petition.getStatus());
        }

        // Takvim çakışması kontrolü artık frontend'de uyarı olarak yapılıyor, burada engellemiyoruz.
        // checkDateConflict(petition);

        petition.setStatus(PetitionStatus.APPROVED);
        Petition updated = petitionRepository.save(petition);

        log.info("Dilekçe admin tarafından onaylandı: id={}, admin={}", petitionId, adminUsername);
        return petitionMapper.toResponse(updated);
    }

    /**
     * Dilekçeyi reddeder (Danışman veya Admin).
     */
    @Transactional
    public PetitionResponse reject(Long petitionId, String username, String reason) {
        User user = userService.findByUsername(username);
        Petition petition = findPetitionById(petitionId);

        if (user.getRole() == Role.ADVISOR) {
            validateAdvisorAccess(petition, user);
            if (petition.getStatus() != PetitionStatus.PENDING_ADVISOR) {
                throw new BusinessException("Bu dilekçe danışman incelemesi aşamasında değil");
            }
        } else if (user.getRole() == Role.ADMIN) {
            if (petition.getStatus() != PetitionStatus.PENDING_ADMIN) {
                throw new BusinessException("Bu dilekçe admin incelemesi aşamasında değil");
            }
        } else {
            throw new BusinessException("Bu işlem için yetkiniz bulunmamaktadır");
        }

        petition.setStatus(PetitionStatus.REJECTED);
        petition.setRejectionReason(reason);
        Petition updated = petitionRepository.save(petition);

        log.info("Dilekçe reddedildi: id={}, reddeden={}, sebep={}", petitionId, username, reason);
        return petitionMapper.toResponse(updated);
    }

    /**
     * Danışmana ait kulüplerin dilekçelerini listeler (PENDING_ADVISOR durumundakiler).
     */
    public List<PetitionResponse> getPetitionsForAdvisor(String advisorUsername) {
        User advisor = userService.findByUsername(advisorUsername);
        List<Petition> petitions = petitionRepository.findByClubAdvisorId(advisor.getId());
        return petitionMapper.toResponseList(petitions);
    }

    /**
     * Admin için bekleyen tüm dilekçeleri listeler (PENDING_ADMIN durumundakiler).
     */
    public List<PetitionResponse> getPetitionsForAdmin() {
        List<Petition> petitions = petitionRepository.findByStatus(PetitionStatus.PENDING_ADMIN);
        return petitionMapper.toResponseList(petitions);
    }

    /**
     * Tüm dilekçeleri listeler (Admin paneli).
     */
    public List<PetitionResponse> getAllPetitions() {
        List<Petition> petitions = petitionRepository.findAll();
        return petitionMapper.toResponseList(petitions);
    }

    /**
     * Takvim görünümü: REJECTED hariç tüm dilekçeler.
     */
    public List<PetitionResponse> getCalendarPetitions() {
        List<Petition> petitions = petitionRepository.findAll().stream()
                .filter(p -> p.getStatus() != PetitionStatus.REJECTED)
                .toList();
        return petitionMapper.toResponseList(petitions);
    }

    /**
     * Başkanın kendi dilekçelerini listeler.
     */
    public List<PetitionResponse> getMyPetitions(String username) {
        User user = userService.findByUsername(username);
        List<Petition> petitions = petitionRepository.findByCreatedById(user.getId());
        return petitionMapper.toResponseList(petitions);
    }

    /**
     * Dilekçeyi ID ile getirir.
     */
    public PetitionResponse getPetitionById(Long id) {
        return petitionMapper.toResponse(findPetitionById(id));
    }

    // ==================== Yardımcı metotlar ====================

    private Petition findPetitionById(Long id) {
        return petitionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dilekçe", "id", id));
    }

    /**
     * Danışmanın, dilekçenin ait olduğu kulübün danışmanı olduğunu doğrular.
     */
    private void validateAdvisorAccess(Petition petition, User advisor) {
        if (advisor.getRole() != Role.ADVISOR) {
            throw new BusinessException("Bu işlem sadece danışmanlar tarafından yapılabilir");
        }
        if (!petition.getClub().getAdvisor().getId().equals(advisor.getId())) {
            throw new BusinessException("Bu dilekçe sizin danışmanı olduğunuz kulübe ait değil");
        }
    }

    /**
     * Belirli bir tarihteki onaylanmış veya onay bekleyen etkinlikleri getirir (Takvim çakışması uyarısı için).
     */
    public List<PetitionResponse> getPetitionsByDate(LocalDate date) {
        List<Petition> petitions = petitionRepository.findByEventDateAndStatusIn(
                date,
                List.of(PetitionStatus.APPROVED, PetitionStatus.PENDING_ADMIN, PetitionStatus.PENDING_ADVISOR)
        );
        return petitionMapper.toResponseList(petitions);
    }
}
