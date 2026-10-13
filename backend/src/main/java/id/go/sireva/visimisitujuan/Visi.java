package id.go.sireva.visimisitujuan;

import java.time.LocalDateTime;

public record Visi(Long id, Integer periodeId, String visiText, LocalDateTime createdAt) {}