package id.go.sireva.visimisitujuan;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verifyNoInteractions;
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
class VisiMisiTujuanServiceTest {
    @Mock
    private VisiRepository visiRepository;

    @Mock
    private MisiRepository misiRepository;

    @Mock
    private TujuanRepository tujuanRepository;

    private VisiMisiTujuanService service;

    @BeforeEach
    void setUp() {
        service = new VisiMisiTujuanService(visiRepository, misiRepository, tujuanRepository);
    }

    @Test
    void findVisiReturnsRowsFromRepository() {
        List<Visi> visions = List.of(new Visi(1L, 2, "Visi", null));
        when(visiRepository.find(null)).thenReturn(visions);

        assertEquals(visions, service.findVisi(null));
    }

    @Test
    void saveVisiRejectsBlankText() {
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> service.saveVisi(new VisiRequest(null, 2, " ")));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void saveMisiDelegatesRequest() {
        MisiRequest request = new MisiRequest(null, 1, "M1", "Misi");
        List<Misi> missions = List.of(new Misi(3L, 1, "M1", "Misi"));
        when(misiRepository.save(request)).thenReturn(missions);

        assertEquals(missions, service.saveMisi(request));
    }

    @Test
    void saveTujuanDelegatesRequest() {
        TujuanRequest request = new TujuanRequest(null, 3, "T1", "Tujuan");
        List<Tujuan> goals = List.of(new Tujuan(4L, 3, "T1", "Tujuan"));
        when(tujuanRepository.save(request)).thenReturn(goals);

        assertEquals(goals, service.saveTujuan(request));
    }

    @Test
    void deleteVisiRequiresId() {
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> service.deleteVisi(null));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        verifyNoInteractions(visiRepository);
    }
}