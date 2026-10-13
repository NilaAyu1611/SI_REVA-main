package id.go.sireva.auth;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AuthUserResponse(
        Long id,
        String username,
        String alias,
        @JsonProperty("unit_kerja") String unitKerja,
        @JsonProperty("role_id") Integer roleId,
        String role
) {}