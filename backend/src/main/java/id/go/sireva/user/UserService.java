package id.go.sireva.user;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserResponse> findAll() {
        return userRepository.findAll().stream().map(UserResponse::from).toList();
    }

    public UserResponse save(SaveUserRequest request) {
        boolean creating = request.id() == null;
        String passwordHash = null;
        if (request.password() != null && !request.password().isBlank()) {
            passwordHash = passwordEncoder.encode(request.password());
        } else if (creating) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password wajib diisi untuk user baru");
        }

        // Teks role selalu mengikuti tabel roles agar konsisten dengan role_id.
        String roleName = request.role();
        if (request.roleId() != null) {
            roleName = userRepository.findRoleName(request.roleId())
                    .map(name -> name.trim().toLowerCase())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role tidak valid"));
        }

        var saved = creating
                ? userRepository.create(request.username(), passwordHash, request.alias(), request.unitKerja(),
                        request.roleId(), roleName)
                : userRepository.update(request.id(), request.username(), passwordHash, request.alias(),
                        request.unitKerja(), request.roleId(), roleName);

        return saved.map(UserResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User tidak ditemukan"));
    }

    public UserResponse delete(Long id) {
        return userRepository.deleteById(id).map(UserResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User tidak ditemukan"));
    }
}