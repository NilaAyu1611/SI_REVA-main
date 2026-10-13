package id.go.sireva.unitkerja;

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
class UnitKerjaServiceTest {
    @Mock
    private UnitKerjaRepository repository;

    private UnitKerjaService service;

    @BeforeEach
    void setUp() {
        service = new UnitKerjaService(repository);
    }

    @Test
    void findAllDeduplicatesByNameAndKeepsFirstRow() {
        UnitKerja first = unit(1L, "Unit A", null);
        when(repository.findAll()).thenReturn(List.of(first, unit(2L, "Unit A", null), unit(3L, "Unit B", null)));

        List<UnitKerja> result = service.findAll();

        assertEquals(List.of(first, unit(3L, "Unit B", null)), result);
    }

    @Test
    void saveRejectsBlankName() {
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> service.save(new SaveUnitKerjaRequest(null, "  ", null, null)));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void saveWithIdUpdatesExistingUnit() {
        UnitKerja updated = unit(7L, "Unit Baru", null);
        SaveUnitKerjaRequest request = new SaveUnitKerjaRequest(7L, " Unit Baru ", null, null);
        when(repository.update(7L, request)).thenReturn(Optional.of(updated));

        assertEquals(updated, service.save(request));
        verify(repository).update(7L, request);
    }

    @Test
    void organizationTreeNestsUnitsUnderTheirParent() {
        UnitKerja parent = unit(1L, "Pusat", null);
        UnitKerja child = unit(2L, "Cabang", 1);
        when(repository.findAllForOrganization()).thenReturn(List.of(parent, child));

        List<UnitKerjaService.OrgNode> roots = service.organizationTree();

        assertEquals(1, roots.size());
        assertEquals(1L, roots.get(0).id());
        assertEquals(1, roots.get(0).children().size());
        assertEquals(2L, roots.get(0).children().get(0).id());
    }

    private UnitKerja unit(Long id, String name, Integer parentId) {
        return new UnitKerja(id, name, null, parentId, null, null);
    }
}