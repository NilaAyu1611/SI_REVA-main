package id.go.sireva.dashboard;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {
    @Mock
    private DashboardRepository repository;

    private DashboardService service;

    @BeforeEach
    void setUp() {
        service = new DashboardService(repository);
    }

    @Test
    void statsAveragesCapaianAndListsUnderperformingIku() {
        when(repository.countIndikatorProgram()).thenReturn(1L);
        when(repository.countIndikatorKegiatan()).thenReturn(1L);
        when(repository.programReports()).thenReturn(List.of(new DashboardRepository.Report("Biro A", 50, 100)));
        when(repository.kegiatanReports()).thenReturn(List.of(new DashboardRepository.Report("Biro A", 200, 100)));
        when(repository.strategisCapaian()).thenReturn(List.of(80.0));
        when(repository.unitNames()).thenReturn(List.of("Biro A", "Biro B"));
        when(repository.programIkus()).thenReturn(List.of(new DashboardRepository.IkuRow("IKU 1", "Biro A", 100, 50)));
        when(repository.kegiatanIkus()).thenReturn(List.of());

        Map<String, Object> stats = service.stats();

        assertEquals(75.0, stats.get("capaian"));
        assertEquals(50.0, stats.get("capaianSp"));
        assertEquals(100.0, stats.get("capaianSk"));
        assertEquals(80.0, stats.get("capaianSs"));
        assertEquals(1L, stats.get("belumTercapai"));
        List<?> units = (List<?>) stats.get("capaianUnit");
        assertEquals(Map.of("name", "Biro A", "value", 75.0), units.get(0));
        assertEquals(Map.of("name", "Biro B", "value", 0.0), units.get(1));
        Map<?, ?> iku = (Map<?, ?>) ((List<?>) stats.get("ikuPrioritas")).get(0);
        assertEquals("50.0%", iku.get("capaian"));
        assertEquals("Belum Tercapai", iku.get("status"));
        assertEquals(1, iku.get("no"));
    }

    @Test
    void statsFallsBackToZerosWhenQueriesFail() {
        when(repository.countIndikatorProgram()).thenThrow(new IllegalStateException("db down"));

        Map<String, Object> stats = service.stats();

        assertEquals(0, stats.get("ss"));
        assertEquals(List.of(), stats.get("ikuPrioritas"));
    }
}
