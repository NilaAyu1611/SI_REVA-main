package id.go.sireva.user;

import java.time.LocalDateTime;

public record StoredUser(
                Long id,
                String username,
                String passwordHash,
                String alias,
                String unitKerja,
                Integer roleId,
                String role,
                LocalDateTime createdAt) {
}