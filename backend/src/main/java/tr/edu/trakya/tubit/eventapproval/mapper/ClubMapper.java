package tr.edu.trakya.tubit.eventapproval.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import tr.edu.trakya.tubit.eventapproval.dto.ClubResponse;
import tr.edu.trakya.tubit.eventapproval.entity.Club;

@Mapper(componentModel = "spring")
public interface ClubMapper {

    @Mapping(source = "advisor.username", target = "advisorUsername")
    @Mapping(source = "president.username", target = "presidentUsername")
    ClubResponse toResponse(Club club);
}
