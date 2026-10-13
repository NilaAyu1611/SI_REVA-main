package id.go.sireva.periode;

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
class PeriodeServiceTest {
    @Mock
    private PeriodeRepository repository;

    private PeriodeService service;

    @BeforeEach
    void setUp() {
        service = new PeriodeService(repository);
    }

    @Test
    void findWithoutIdReturnsAllPeriods() {
        List<Periode> periods = List.of(new Periode(1L, "Renstra", 2025, 2029, true));
        when(repository.findAll()).thenReturn(periods);

        assertEquals(periods, service.find(null));
    }

    @Test
    void findByIdReturnsArrayShape() {
        List<Periode> periods = List.of(new Periode(1L, "Renstra", 2025, 2029, true));
        when(repository.findById(1L)).thenReturn(periods);

        assertEquals(periods, service.find(1L));
    }

    @Test
    void saveCreatesPeriod() {
        PeriodeRequest request = new PeriodeRequest(null, "Renstra", 2025, 2029, true);
        Periode period = new Periode(1L, "Renstra", 2025, 2029, true);
        when(repository.create(request)).thenReturn(Optional.of(period));

        assertEquals(List.of(period), service.save(request));
    }

    @Test
    void deleteRequiresId() {
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> service.delete(null));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }
}