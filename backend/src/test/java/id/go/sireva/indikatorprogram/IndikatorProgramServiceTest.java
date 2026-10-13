package id.go.sireva.indikatorprogram;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
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
class IndikatorProgramServiceTest {
    @Mock
    private IndikatorProgramRepository repository;

    private IndikatorProgramService service;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        service = new IndikatorProgramService(repository);
    }

    @Test
    void findForwardsSasaranFilter() {
        List<IndikatorProgram> indicators = List.of(
                new IndikatorProgram(1L, 12, "IK-1", "Indikator", "persen", null, null,
                        "10", "20", null, null, null));
        when(repository.find(12)).thenReturn(indicators);

        assertEquals(indicators, service.find(12));
    }

    @Test
    void createSupportsArrayPayloadWithCamelCaseFields() throws Exception {
        var body = objectMapper.readTree("""
                [{"id":9,"sasaranProgramId":12,"kode":"IK-1","nama":"Indikator","satuan":"persen"}]
                """);
        List<IndikatorProgram> created = List.of(
                new IndikatorProgram(1L, 12, "IK-1", "Indikator", "persen", null, null, null, null, null, null, null));
        when(repository.createBatch(List.of(
                new IndikatorProgramRequest(9L, 12, "IK-1", "Indikator", "persen", null, null))))
                .thenReturn(created);

        assertEquals(created, service.create(body));
    }

    @Test
    void updateRequiresId() throws Exception {
        var body = objectMapper.readTree("{\"satuan\":\"persen\"}");

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> service.update(body));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void deleteForwardsId() throws Exception {
        var body = objectMapper.readTree("{\"id\":5}");
        List<IndikatorProgram> deleted = List.of(
                new IndikatorProgram(5L, 12, "IK-1", "Indikator", "persen", null, null, null, null, null, null, null));
        when(repository.delete(5L)).thenReturn(deleted);

        assertEquals(deleted, service.delete(body));
        verify(repository).delete(5L);
    }
}