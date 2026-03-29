package tr.edu.trakya.kycuby.eventapproval.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
     * Tarih aralığında çakışan dilekçeleri, club ve createdBy ilişkileriyle birlikte getirir.
     */
    @Query("SELECT p FROM Petition p JOIN FETCH p.club JOIN FETCH p.createdBy " +
           "WHERE p.eventStartDate <= :endDate AND p.eventEndDate >= :startDate " +
           "AND p.status IN :statuses")
    List<Petition> findOverlappingPetitions(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("statuses") List<PetitionStatus> statuses);

    /**
     * Takvim çakışması kontrolü: aynı tarih ve lokasyonda onaylanmış etkinlik var mı?
     */
    boolean existsByEventStartDateLessThanEqualAndEventEndDateGreaterThanEqualAndLocationAndStatusIn(
            LocalDate endDate,
            LocalDate startDate,
            String location,
            List<PetitionStatus> statuses
    );
}
