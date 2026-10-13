package id.go.sireva.indikatorstrategis;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class IndikatorStrategisServiceTest {
    @Mock
    private IndikatorStrategisRepository repository;

    private IndikatorStrategisService service;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        service = new IndikatorStrategisService(repository);
    }

    @Test
    void findForwardsParentFilter() {
        List<IndikatorStrategis> rows = List.of(new IndikatorStrategis(1L, 9, "IK-1", "Indikator", "persen", null, null));
        when(repository.find(9)).thenReturn(rows);

        assertEquals(rows, service.find(9));
    }

    @Test
    void createSupportsArrayPayload() throws Exception {
        var body = objectMapper.readTree("""
                [{"sasaranStrategisId":9,"kode":"IK-1","nama":"Indikator","satuan":"persen"}]
                """);
        List<IndikatorStrategis> request = List.of(
            new IndikatorStrategis(null, 9, "IK-1", "Indikator", "persen", null, null));
        List<IndikatorStrategis> expected = List.of(
                new IndikatorStrategis(1L, 9, "IK-1", "Indikator", "persen", null, null));
        when(repository.createBatch(request)).thenReturn(expected);

        assertEquals(expected, service.create(body));
    }

    @Test
    void updateRequiresId() throws Exception {
        var body = objectMapper.readTree("{\"nama\":\"Updated\"}");

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> service.update(body));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void deleteRequiresId() throws Exception {
        var body = objectMapper.readTree("{}");

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> service.delete(body));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }
}