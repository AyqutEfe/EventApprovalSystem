package tr.edu.trakya.kycuby.eventapproval.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import tr.edu.trakya.kycuby.eventapproval.dto.UserResponse;
import tr.edu.trakya.kycuby.eventapproval.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(source = "role", target = "role")
    UserResponse toResponse(User user);
}
