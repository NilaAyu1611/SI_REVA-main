package id.go.sireva.perjanjiankinerja;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class PerjanjianKinerjaServiceTest {
    private final ObjectMapper mapper = new ObjectMapper();

    @Mock
    private PerjanjianKinerjaRepository repository;

    private PerjanjianKinerjaService service;

    @BeforeEach
    void setUp() {
        service = new PerjanjianKinerjaService(repository);
    }

    @Test
    void findIgnoresAllUnitsFilter() {
        when(repository.find(2026, null)).thenReturn(List.of());

        assertEquals(List.of(), service.find(2026, "Semua Unit Kerja"));
    }

    @Test
    void createRejectsDuplicateCommitment() throws Exception {
        var body = mapper.readTree("""
                {"tahun":2026,"unitKerja":"Biro A","sasaranId":1,"indikatorId":2,"target":"10"}""");
        when(repository.exists(2026, 2L, "Biro A")).thenReturn(true);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> service.create(body));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        verify(repository, never()).insert(2026, "Biro A", 1L, 2L, "10", "Draft");
    }

    @Test
    void createDefaultsStatusToDraft() throws Exception {
        var body = mapper.readTree("""
                {"tahun":2026,"unitKerja":"Biro A","sasaranId":1,"indikatorId":2,"target":"10"}""");
        Map<String, Object> saved = Map.of("id", 5);
        when(repository.exists(2026, 2L, "Biro A")).thenReturn(false);
        when(repository.insert(2026, "Biro A", 1L, 2L, "10", "Draft")).thenReturn(saved);

        assertEquals(List.of(saved), service.create(body));
    }

    @Test
    void createWithoutIndicatorReturnsBadRequest() throws Exception {
        var body = mapper.readTree("{\"tahun\":2026,\"unitKerja\":\"Biro A\",\"sasaranId\":1}");

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> service.create(body));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }
}
