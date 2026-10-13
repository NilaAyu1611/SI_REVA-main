package id.go.sireva.sasaranprogram;

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
class SasaranProgramServiceTest {
    @Mock
    private SasaranProgramRepository repository;

    private SasaranProgramService service;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        service = new SasaranProgramService(repository);
    }

    @Test
    void findForwardsFilters() {
        List<Map<String, Object>> rows = List.of(Map.of("id", 2L, "kode", "SP-01.01"));
        when(repository.findFlattened(null, 1, null)).thenReturn(rows);

        assertEquals(rows, service.find(null, 1, null));
    }

    @Test
    void createLocksParentAndGeneratesChildCode() throws Exception {
        var body = objectMapper.readTree("""
                {"ss_id":1,"nama_sp":"Program","pengampu":"Unit"}
                """);
        when(repository.lockParentCode(1L)).thenReturn("SS-02");
        when(repository.maxOrderForParent(1L)).thenReturn(3);
        when(repository.create(1L, null, 4, "SP-02.04", "Program", "Unit", null))
                .thenReturn(sasaran(6L, "SP-02.04"));

        Map<String, Object> response = service.create(body);

        assertEquals(true, response.get("success"));
        verify(repository).lockParentCode(1L);
        verify(repository).create(1L, null, 4, "SP-02.04", "Program", "Unit", null);
    }

    @Test
    void createRejectsClientGeneratedCode() throws Exception {
        var body = objectMapper.readTree("""
                {"ss_id":1,"nama_sp":"Program","kode_sp":"manual"}
                """);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> service.create(body));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void updateRejectsImmutableParentId() throws Exception {
        var body = objectMapper.readTree("{\"ss_id\":1,\"nama_sp\":\"Updated\"}");

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> service.update(6L, body));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void pathDeleteRejectsActiveChildren() {
        when(repository.findActiveById(6L)).thenReturn(Optional.of(sasaran(6L, "SP-02.04")));
        when(repository.countActiveChildren(6L)).thenReturn(2);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> service.deleteById(6L));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        verify(repository, never()).softDelete(6L, true);
    }

    @Test
    void collectionDeleteUsesLegacySoftDeleteBehavior() {
        when(repository.softDelete(6L, false)).thenReturn(true);

        Map<String, Object> response = service.deleteCollection(6L);

        assertEquals(true, response.get("success"));
        verify(repository).softDelete(6L, false);
        verify(repository, never()).countActiveChildren(6L);
    }

    private SasaranProgram sasaran(Long id, String code) {
        return new SasaranProgram(id, 1, 4, code, "Program", "Unit", null, null, true,
                null, null, null);
    }
}