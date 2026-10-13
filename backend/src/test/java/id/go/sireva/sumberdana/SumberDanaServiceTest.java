package id.go.sireva.sumberdana;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
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
class SumberDanaServiceTest {
    @Mock
    private SumberDanaRepository repository;

    private SumberDanaService service;

    @BeforeEach
    void setUp() {
        service = new SumberDanaService(repository);
    }

    @Test
    void saveCreatesNamedSource() {
        SumberDanaRequest request = new SumberDanaRequest(null, "APBN");
        List<SumberDana> saved = List.of(new SumberDana(1L, "APBN"));
        when(repository.save(request)).thenReturn(saved);

        assertEquals(saved, service.save(request));
    }

    @Test
    void saveRejectsBlankName() {
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> service.save(new SumberDanaRequest(null, " ")));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void deleteRequiresId() {
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> service.delete(null));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }
}