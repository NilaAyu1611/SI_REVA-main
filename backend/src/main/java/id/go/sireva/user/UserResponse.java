package id.go.sireva.user;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UserResponse(
        Long id,
        String username,
        String alias,
        @JsonProperty("unit_kerja") String unitKerja,
        @JsonProperty("role_id") Integer roleId,
        String role,
        @JsonProperty("created_at") LocalDateTime createdAt) {
    static UserResponse from(StoredUser user) {
        return new UserResponse(
                user.id(), user.username(), user.alias(), user.unitKerja(), user.roleId(), user.role(),
                user.createdAt());
    }
}