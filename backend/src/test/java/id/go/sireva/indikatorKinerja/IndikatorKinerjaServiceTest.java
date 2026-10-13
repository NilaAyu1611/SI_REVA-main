package id.go.sireva.indikatorKinerja;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
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
class IndikatorKinerjaServiceTest {
    @Mock
    private IndikatorKinerjaRepository repository;

    private IndikatorKinerjaService service;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        service = new IndikatorKinerjaService(repository);
    }

    @Test
    void findByIdReturnsActiveIndicator() {
        IndikatorKinerja indicator = indicator(5L, "IKU-01.01");
        when(repository.findActiveById(5L)).thenReturn(Optional.of(indicator));

        assertEquals(indicator, service.find(5L, null));
    }

    @Test
    void findWithoutIdForwardsSasaranFilter() {
        List<IndikatorKinerja> indicators = List.of(indicator(5L, "IKU-01.01"));
        when(repository.findAll(8)).thenReturn(indicators);

        assertEquals(indicators, service.find(null, 8));
    }

    @Test
    void createGeneratesNextCodeFromLockedParent() throws Exception {
        var body = objectMapper.readTree("""
                {"sk_id":8,"nama_iku":"Indikator","satuan":"persen"}
                """);
        when(repository.lockParentCode(8)).thenReturn("SK-01.03");
        when(repository.findMaxOrder(8)).thenReturn(3);
        when(repository.create(8, 4, "IKU-01.03.04", "Indikator", "persen", null, null))
                .thenReturn(indicator(12L, "IKU-01.03.04"));

        Map<String, Object> response = service.create(body);

        assertEquals(true, response.get("success"));
        verify(repository).lockParentCode(8);
        verify(repository).create(8, 4, "IKU-01.03.04", "Indikator", "persen", null, null);
    }

    @Test
    void createRejectsClientGeneratedCode() throws Exception {
        var body = objectMapper.readTree("""
                {"sk_id":8,"nama_iku":"Indikator","kode_iku":"manual"}
                """);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> service.create(body));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void updateRejectsImmutableParentAndCode() throws Exception {
        var body = objectMapper.readTree("{\"sk_id\":8,\"nama_iku\":\"Updated\"}");

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> service.update(5L, body));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void deleteUsesSoftDelete() {
        when(repository.softDelete(5L)).thenReturn(true);

        Map<String, Object> response = service.delete(5L);

        assertEquals(true, response.get("success"));
        verify(repository).softDelete(5L);
    }

    private IndikatorKinerja indicator(Long id, String code) {
        return new IndikatorKinerja(id, 8, 1, code, "Indikator", "persen", null, null,
                true, null, null, null, null, null, null, null, null);
    }
}