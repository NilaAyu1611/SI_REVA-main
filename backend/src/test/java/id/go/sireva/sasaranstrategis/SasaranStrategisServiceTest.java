package id.go.sireva.sasaranstrategis;

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
class SasaranStrategisServiceTest {
    @Mock
    private SasaranStrategisRepository repository;

    private SasaranStrategisService service;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        service = new SasaranStrategisService(repository);
    }

    @Test
    void findListReturnsFlattenedRows() {
        List<Map<String, Object>> rows = List.of(Map.of("id", 1L, "ssId", 1L));
        when(repository.findAllFlattened()).thenReturn(rows);

        assertEquals(rows, service.find(null));
    }

    @Test
    void createAcceptsSasaranTextAliasAndGeneratesCode() throws Exception {
        var body = objectMapper.readTree("{\"sasaranText\":\"Sasaran\",\"tahun\":\"2026\"}");
        SasaranStrategis created = sasaran(4L, "SS-03", "Sasaran");
        when(repository.maxOrderForYear("2026")).thenReturn(2);
        when(repository.create("2026", 3, "SS-03", "Sasaran", null, null)).thenReturn(created);

        Map<String, Object> response = service.create(body);

        assertEquals(true, response.get("success"));
        verify(repository).lockYear("2026");
        verify(repository).create("2026", 3, "SS-03", "Sasaran", null, null);
    }

    @Test
    void createRequiresName() throws Exception {
        var body = objectMapper.readTree("{\"tahun\":\"2026\"}");

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> service.create(body));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void deleteRejectsSasaranWithActiveProgramChildren() {
        when(repository.findActiveById(4L)).thenReturn(Optional.of(sasaran(4L, "SS-03", "Sasaran")));
        when(repository.countActiveChildren(4L)).thenReturn(1);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> service.delete(4L));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        verify(repository, never()).softDelete(4L);
    }

    @Test
    void deleteSoftDeletesWhenThereAreNoActiveChildren() {
        when(repository.findActiveById(4L)).thenReturn(Optional.of(sasaran(4L, "SS-03", "Sasaran")));
        when(repository.countActiveChildren(4L)).thenReturn(0);
        when(repository.softDelete(4L)).thenReturn(true);

        Map<String, Object> response = service.delete(4L);

        assertEquals(true, response.get("success"));
        verify(repository).softDelete(4L);
    }

    private SasaranStrategis sasaran(Long id, String code, String name) {
        return new SasaranStrategis(id, "2026", 3, code, name, null, null, true, null, null, null);
    }
}