package id.go.sireva.auth;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import id.go.sireva.user.StoredUser;
import id.go.sireva.user.UserRepository;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse login(LoginRequest request) {
        return userRepository.findByUsername(request.usernameOrEmail())
                .filter(user -> passwordEncoder.matches(request.password(), user.passwordHash()))
                .map(this::toResponse)
                .map(LoginResponse::succeeded)
                .orElseGet(LoginResponse::failed);
    }

    private AuthUserResponse toResponse(StoredUser user) {
        return new AuthUserResponse(
                user.id(),
                user.username(),
                user.alias(),
                user.unitKerja(),
                user.roleId(),
                user.role()
        );
    }
}