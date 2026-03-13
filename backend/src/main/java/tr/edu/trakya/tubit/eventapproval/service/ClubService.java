package tr.edu.trakya.tubit.eventapproval.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tr.edu.trakya.tubit.eventapproval.entity.Club;
import tr.edu.trakya.tubit.eventapproval.exception.ResourceNotFoundException;
import tr.edu.trakya.tubit.eventapproval.repository.ClubRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClubService {

    private final ClubRepository clubRepository;

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
}
