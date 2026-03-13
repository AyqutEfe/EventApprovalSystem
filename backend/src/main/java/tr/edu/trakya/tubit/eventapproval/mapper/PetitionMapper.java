package tr.edu.trakya.tubit.eventapproval.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import tr.edu.trakya.tubit.eventapproval.dto.PetitionResponse;
import tr.edu.trakya.tubit.eventapproval.entity.Petition;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PetitionMapper {

    @Mapping(source = "club.name", target = "clubName")
    @Mapping(source = "createdBy.username", target = "createdByUsername")
    @Mapping(source = "status", target = "status")
    PetitionResponse toResponse(Petition petition);

    List<PetitionResponse> toResponseList(List<Petition> petitions);
}
