package id.go.sireva.unitkerja;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OrganisasiController {
    private final UnitKerjaService service;

    public OrganisasiController(UnitKerjaService service) {
        this.service = service;
    }

    @GetMapping("/api/organisasi")
    public List<UnitKerjaService.OrgNode> organizationTree() {
        return service.organizationTree();
    }
}