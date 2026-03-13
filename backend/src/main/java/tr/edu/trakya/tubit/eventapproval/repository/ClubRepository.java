package tr.edu.trakya.tubit.eventapproval.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tr.edu.trakya.tubit.eventapproval.entity.Club;

import java.util.Optional;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {

    Optional<Club> findByPresidentId(Long presidentId);

    Optional<Club> findByAdvisorId(Long advisorId);

    boolean existsByName(String name);
}
