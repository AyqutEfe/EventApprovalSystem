package tr.edu.trakya.kycuby.eventapproval.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tr.edu.trakya.kycuby.eventapproval.dto.RegisterRequest;
import tr.edu.trakya.kycuby.eventapproval.dto.UserResponse;
import tr.edu.trakya.kycuby.eventapproval.entity.User;
import tr.edu.trakya.kycuby.eventapproval.entity.enums.Role;
import tr.edu.trakya.kycuby.eventapproval.exception.BusinessException;
import tr.edu.trakya.kycuby.eventapproval.exception.ResourceNotFoundException;
import tr.edu.trakya.kycuby.eventapproval.mapper.UserMapper;
import tr.edu.trakya.kycuby.eventapproval.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .toList();
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı", "username", username));
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı", "id", id));
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new BusinessException("Bu kullanıcı adı zaten kullanılıyor: " + request.username());
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException("Bu e-posta adresi zaten kullanılıyor: " + request.email());
        }

        User user = User.builder()
                .username(request.username())
                .password(passwordEncoder.encode(request.password()))
                .email(request.email())
                .role(Role.valueOf(request.role().toUpperCase()))
                .build();

        User savedUser = userRepository.save(user);
        return userMapper.toResponse(savedUser);
    }
}
