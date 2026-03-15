package tr.edu.trakya.kycuby.eventapproval.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tr.edu.trakya.kycuby.eventapproval.dto.ClubRequest;
import tr.edu.trakya.kycuby.eventapproval.dto.ClubResponse;
import tr.edu.trakya.kycuby.eventapproval.entity.Club;
import tr.edu.trakya.kycuby.eventapproval.entity.User;
import tr.edu.trakya.kycuby.eventapproval.entity.enums.Role;
import tr.edu.trakya.kycuby.eventapproval.exception.BusinessException;
import tr.edu.trakya.kycuby.eventapproval.exception.ResourceNotFoundException;
import tr.edu.trakya.kycuby.eventapproval.mapper.ClubMapper;
import tr.edu.trakya.kycuby.eventapproval.repository.ClubRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClubService {

    private final ClubRepository clubRepository;
    private final ClubMapper clubMapper;
    private final UserService userService;

    public Club findById(Long id) {
        return clubRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kulüp", "id", id));
    }

    public Club findByPresidentId(Long presidentId) {
        return clubRepository.findByPresidentId(presidentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Bu başkana ait kulüp bulunamadı. presidentId=" + presidentId));
    }

    public Club findByAdvisorId(Long advisorId) {
        return clubRepository.findByAdvisorId(advisorId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Bu danışmana ait kulüp bulunamadı. advisorId=" + advisorId));
    }

    public List<ClubResponse> getAllClubs() {
        return clubRepository.findAll().stream()
                .map(clubMapper::toResponse)
                .toList();
    }

    @Transactional
    public ClubResponse createClub(ClubRequest request) {
        // Kulüp adı kontrolü
        if (clubRepository.existsByName(request.name())) {
            throw new BusinessException("Bu isimde bir kulüp zaten mevcut: " + request.name());
        }

        User advisor = userService.findById(request.advisorId());
        User president = userService.findById(request.presidentId());

        // Rol kontrolleri
        if (advisor.getRole() != Role.ADVISOR) {
            throw new BusinessException("Belirtilen kullanıcı danışman rolünde değil: " + advisor.getUsername());
        }
        if (president.getRole() != Role.PRESIDENT) {
            throw new BusinessException("Belirtilen kullanıcı başkan rolünde değil: " + president.getUsername());
        }

        Club club = Club.builder()
                .name(request.name())
                .advisor(advisor)
                .president(president)
                .build();

        Club savedClub = clubRepository.save(club);
        return clubMapper.toResponse(savedClub);
    }
}
