package id.go.sireva.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import id.go.sireva.user.StoredUser;
import id.go.sireva.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(userRepository, passwordEncoder);
    }

    @Test
    void loginReturnsUserWithoutPasswordHashWhenCredentialsMatch() {
        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user()));
        when(passwordEncoder.matches("secret", "password-hash")).thenReturn(true);

        LoginResponse response = authService.login(new LoginRequest("alice", "secret"));

        assertTrue(response.success());
        assertEquals("alice", response.user().username());
        assertEquals("Alice", response.user().alias());
        assertFalse(Arrays.stream(response.user().getClass().getRecordComponents())
                .anyMatch(component -> component.getName().toLowerCase().contains("password")));
        verify(passwordEncoder).matches("secret", "password-hash");
    }

    @Test
    void loginFailsWhenPasswordDoesNotMatch() {
        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user()));
        when(passwordEncoder.matches("wrong", "password-hash")).thenReturn(false);

        LoginResponse response = authService.login(new LoginRequest("alice", "wrong"));

        assertFalse(response.success());
        assertNull(response.user());
    }

    @Test
    void loginFailsWhenUserDoesNotExist() {
        when(userRepository.findByUsername("missing")).thenReturn(Optional.empty());

        LoginResponse response = authService.login(new LoginRequest("missing", "secret"));

        assertFalse(response.success());
        verify(passwordEncoder, never()).matches("secret", "password-hash");
    }

    private StoredUser user() {
        return new StoredUser(1L, "alice", "password-hash", "Alice", "Unit A", 2, "admin",
                LocalDateTime.of(2026, 1, 1, 0, 0));
    }
}