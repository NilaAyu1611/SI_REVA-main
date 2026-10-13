package id.go.sireva.user;

import jakarta.validation.constraints.NotNull;

public record DeleteUserRequest(@NotNull Long id) {
}