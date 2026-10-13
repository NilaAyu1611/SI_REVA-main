package id.go.sireva.laporankinerjatriwulan;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class LaporanKinerjaTriwulanServiceTest {
    @Mock
    private LaporanKinerjaTriwulanRepository repository;

    private LaporanKinerjaTriwulanService service;

    @BeforeEach
    void setUp() {
        service = new LaporanKinerjaTriwulanService(repository);
    }

    @Test
    void saveRequiresYearQuarterAndUnit() {
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> service.save(new LaporanKinerjaTriwulan(null, 0, "", "", null, null, null, null, null, null, null)));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void saveInsertsNewReportWithDraftDefaults() {
        LaporanKinerjaTriwulan request = report(null, "Unit A");
        LaporanKinerjaTriwulan inserted = new LaporanKinerjaTriwulan(1L, 2026, "TW1", "Unit A",
                "", "", "", "", null, "Draft", null);
        when(repository.findUnique(2026, "TW1", "Unit A")).thenReturn(List.of());
        when(repository.create(any(LaporanKinerjaTriwulan.class))).thenReturn(List.of(inserted));

        var response = service.save(request);

        assertEquals("insert", response.get("action"));
        assertEquals(inserted, response.get("data"));
    }

    @Test
    void saveUpdatesExistingReport() {
        LaporanKinerjaTriwulan request = report(null, "Unit A");
        LaporanKinerjaTriwulan existing = report(5L, "Unit A");
        when(repository.findUnique(2026, "TW1", "Unit A")).thenReturn(List.of(existing));
        when(repository.update(org.mockito.ArgumentMatchers.eq(5L), any(LaporanKinerjaTriwulan.class)))
                .thenReturn(List.of(existing));

        var response = service.save(request);

        assertEquals("update", response.get("action"));
        verify(repository).update(org.mockito.ArgumentMatchers.eq(5L), any(LaporanKinerjaTriwulan.class));
    }

    @Test
    void deleteRequiresId() {
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> service.delete(null));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    private LaporanKinerjaTriwulan report(Long id, String unit) {
        return new LaporanKinerjaTriwulan(id, 2026, "TW1", unit, "Ringkasan", "Pengantar", "RTL",
                "Info", "[]", "Submitted", null);
    }
}