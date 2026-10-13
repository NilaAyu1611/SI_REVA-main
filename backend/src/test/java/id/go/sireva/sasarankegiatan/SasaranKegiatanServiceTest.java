package id.go.sireva.sasarankegiatan;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class SasaranKegiatanServiceTest {
    @Mock
    private SasaranKegiatanRepository repository;

    private SasaranKegiatanService service;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        service = new SasaranKegiatanService(repository);
    }

    @Test
    void findForwardsParentFilter() {
        List<Map<String, Object>> rows = List.of(Map.of("id", 3L, "kode", "SK-01.01.01"));
        when(repository.findFlattened(null, 2, null)).thenReturn(rows);

        assertEquals(rows, service.find(null, 2, null));
    }

    @Test
    void createGeneratesCodeFromLockedProgram() throws Exception {
        var body = objectMapper.readTree("""
                {"sp_id":2,"nama_sk":"Kegiatan","pengampu":"Unit"}
                """);
        when(repository.lockParentCode(2L)).thenReturn("SP-01.03");
        when(repository.maxOrderForParent(2L)).thenReturn(1);
        when(repository.create(2L, 2, "SK-01.03.02", "Kegiatan", "Unit", null))
                .thenReturn(sasaran(3L, "SK-01.03.02"));

        Map<String, Object> response = service.create(body);

        assertEquals(true, response.get("success"));
        verify(repository).create(2L, 2, "SK-01.03.02", "Kegiatan", "Unit", null);
    }

    @Test
    void createRequiresParent() throws Exception {
        var body = objectMapper.readTree("{\"nama_sk\":\"Kegiatan\"}");

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> service.create(body));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void deleteSoftDeletesIndicatorsBeforeParent() {
        when(repository.findActiveById(3L)).thenReturn(Optional.of(sasaran(3L, "SK-01.03.02")));
        when(repository.softDelete(3L)).thenReturn(true);

        Map<String, Object> response = service.delete(3L);

        assertEquals(true, response.get("success"));
        verify(repository).softDeleteIndicators(3L);
        verify(repository).softDelete(3L);
    }

    @Test
    void findForUnitReturnsEmptyWhenUnitHasNoName() {
        when(repository.findUnit(4L)).thenReturn(Optional.of(Map.of("id", 4L)));

        assertEquals(List.of(), service.findForUnit(4L, null));
        verify(repository, never()).findForUnit(4L, null);
    }

    @Test
    void upsertTargetRequiresIndicatorYearAndValue() throws Exception {
        var body = objectMapper.readTree("{\"idIku\":8,\"tahun\":2026}");

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> service.upsertTarget(body));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void upsertTargetDelegatesIndicatorYearAndValue() throws Exception {
        var body = objectMapper.readTree("{\"idIku\":8,\"tahun\":2026,\"targetNilai\":\"12.5\"}");
        List<Map<String, Object>> target = List.of(Map.of("id", 1L, "tahun", 2026));
        when(repository.upsertTarget(8L, 2026, "12.5")).thenReturn(target);

        assertEquals(target, service.upsertTarget(body));
    }

    private SasaranKegiatan sasaran(Long id, String code) {
        return new SasaranKegiatan(id, 2, 2, code, "Kegiatan", "Unit", null, true, null, null, null);
    }
}