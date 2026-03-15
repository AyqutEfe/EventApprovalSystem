package tr.edu.trakya.kycuby.eventapproval.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tr.edu.trakya.kycuby.eventapproval.entity.Petition;
import tr.edu.trakya.kycuby.eventapproval.entity.enums.PetitionStatus;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PetitionRepository extends JpaRepository<Petition, Long> {

    List<Petition> findByStatus(PetitionStatus status);

    List<Petition> findByClubId(Long clubId);

    List<Petition> findByCreatedById(Long userId);

    List<Petition> findByClubAdvisorId(Long advisorId);

    List<Petition> findByStatusIn(List<PetitionStatus> statuses);

    /**
     * Takvim çakışması kontrolü: aynı tarih ve lokasyonda onaylanmış etkinlik var mı?
     */
    boolean existsByEventDateAndLocationAndStatusIn(
            LocalDate eventDate,
            String location,
            List<PetitionStatus> statuses
    );
}
