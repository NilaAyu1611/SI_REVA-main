package id.go.sireva.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SaveUserRequest(
        Long id,
        @NotBlank @Size(max = 255) String username,
        @Size(max = 255) String password,
        @Size(max = 255) String alias,
        @JsonProperty("unit_kerja") String unitKerja,
        @JsonProperty("role_id") Integer roleId,
        @Size(max = 255) String role) {
}