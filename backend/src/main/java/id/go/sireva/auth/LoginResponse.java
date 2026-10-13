package id.go.sireva.auth;

public record LoginResponse(boolean success, AuthUserResponse user, String message) {
    public static LoginResponse failed() {
        return new LoginResponse(false, null, "Username/email atau password salah");
    }

    public static LoginResponse succeeded(AuthUserResponse user) {
        return new LoginResponse(true, user, "Login berhasil");
    }
}