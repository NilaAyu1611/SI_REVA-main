package id.go.sireva.tahun;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class TahunServiceTest {
    @Mock
    private TahunRepository repository;

    private TahunService service;

    @BeforeEach
    void setUp() {
        service = new TahunService(repository);
    }

    @Test
    void findWithoutIdReturnsAllYears() {
        List<Tahun> years = List.of(new Tahun(1L, 2026, 2));
        when(repository.findAll()).thenReturn(years);

        assertEquals(years, service.find(null));
    }

    @Test
    void findByIdKeepsArrayResponseShape() {
        Tahun year = new Tahun(1L, 2026, 2);
        when(repository.findById(1L)).thenReturn(Optional.of(year));

        assertEquals(List.of(year), service.find(1L));
    }

    @Test
    void saveWithoutYearReturnsBadRequest() {
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> service.save(new TahunRequest(null, null, null)));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void saveWithIdUpdatesYear() {
        TahunRequest request = new TahunRequest(1L, 2027, 2);
        Tahun year = new Tahun(1L, 2027, 2);
        when(repository.update(request)).thenReturn(Optional.of(year));

        assertEquals(List.of(year), service.save(request));
        verify(repository).update(request);
    }

    @Test
    void deleteReturnsAnEmptyArrayWhenIdDoesNotExist() {
        when(repository.deleteById(9L)).thenReturn(Optional.empty());

        assertEquals(List.of(), service.delete(9L));
    }
}