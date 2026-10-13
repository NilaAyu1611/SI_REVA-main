package id.go.sireva.user;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private UserService userService;

    @BeforeEach
    void setUp() {
        userService = new UserService(userRepository, passwordEncoder);
    }

    @Test
    void createHashesPasswordAndReturnsSafeResponse() {
        SaveUserRequest request = new SaveUserRequest(null, "alice", "secret", "Alice", "Unit A", 2, "admin");
        when(passwordEncoder.encode("secret")).thenReturn("password-hash");
        when(userRepository.create("alice", "password-hash", "Alice", "Unit A", 2, "admin"))
                .thenReturn(Optional.of(user("password-hash")));

        UserResponse response = userService.save(request);

        assertEquals(1L, response.id());
        assertEquals("alice", response.username());
        assertEquals("Alice", response.alias());
        assertFalse(Arrays.stream(response.getClass().getRecordComponents())
                .anyMatch(component -> component.getName().toLowerCase().contains("password")));
        verify(passwordEncoder).encode("secret");
    }

    @Test
    void editWithoutPasswordKeepsExistingPassword() {
        SaveUserRequest request = new SaveUserRequest(1L, "alice", "", "Alice Updated", "Unit A", 2, "admin");
        when(userRepository.update(1L, "alice", null, "Alice Updated", "Unit A", 2, "admin"))
                .thenReturn(Optional.of(user("password-hash")));

        userService.save(request);

        verify(passwordEncoder, never()).encode("secret");
        verify(userRepository).update(1L, "alice", null, "Alice Updated", "Unit A", 2, "admin");
    }

    @Test
    void createRejectsBlankPassword() {
        SaveUserRequest request = new SaveUserRequest(null, "alice", " ", "Alice", "Unit A", 2, "admin");

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> userService.save(request));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        verify(userRepository, never()).create("alice", null, "Alice", "Unit A", 2, "admin");
    }

    @Test
    void deleteReturnsDeletedUser() {
        when(userRepository.deleteById(1L)).thenReturn(Optional.of(user("password-hash")));

        UserResponse response = userService.delete(1L);

        assertEquals(1L, response.id());
        assertEquals("alice", response.username());
    }

    private StoredUser user(String passwordHash) {
        return new StoredUser(1L, "alice", passwordHash, "Alice", "Unit A", 2, "admin",
                LocalDateTime.of(2026, 1, 1, 0, 0));
    }
}