package id.go.sireva.unitkerja;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UnitKerjaService {
    private final UnitKerjaRepository repository;

    public UnitKerjaService(UnitKerjaRepository repository) {
        this.repository = repository;
    }

    public List<UnitKerja> findAll() {
        Map<String, UnitKerja> uniqueByName = new LinkedHashMap<>();
        for (UnitKerja unit : repository.findAll()) {
            if (unit.nama() != null) {
                uniqueByName.putIfAbsent(unit.nama(), unit);
            }
        }
        return new ArrayList<>(uniqueByName.values());
    }

    public UnitKerja findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Unit kerja tidak ditemukan."));
    }

    public UnitKerja save(SaveUnitKerjaRequest request) {
        if (request.nama() == null || request.nama().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Field \"nama\" wajib diisi.");
        }

        var saved = request.id() == null
                ? repository.create(request)
                : repository.update(request.id(), request);
        return saved.orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Unit kerja tidak ditemukan."));
    }

    public UnitKerja update(Long id, JsonNode body) {
        if (body.has("nama") && (!body.get("nama").isTextual() || body.get("nama").asText().isBlank())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Field \"nama\" tidak boleh kosong.");
        }
        validateInteger(body, "level");
        validateInteger(body, "parentId");

        return repository.updatePartial(id, body)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Unit kerja tidak ditemukan."));
    }

    public UnitKerja delete(Long id) {
        return repository.deleteById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Unit kerja tidak ditemukan."));
    }

    public List<OrgNode> organizationTree() {
        List<UnitKerja> units = repository.findAllForOrganization();
        Map<Long, OrgNode> nodes = new LinkedHashMap<>();
        for (UnitKerja unit : units) {
            nodes.put(unit.id(), new OrgNode(unit.id(), unit.nama(), unit.level(), unit.parentId(), new ArrayList<>()));
        }

        List<OrgNode> roots = new ArrayList<>();
        for (OrgNode node : nodes.values()) {
            Long parentId = node.parentId() == null ? null : node.parentId().longValue();
            if (parentId != null && nodes.containsKey(parentId) && !parentId.equals(node.id())) {
                nodes.get(parentId).children().add(node);
            } else {
                roots.add(node);
            }
        }
        return roots;
    }

    private void validateInteger(JsonNode body, String field) {
        JsonNode value = body.get(field);
        if (value != null && !value.isNull() && !value.canConvertToInt()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Field \"" + field + "\" harus berupa angka.");
        }
    }

    public record OrgNode(Long id, String nama, Integer level, Integer parentId, List<OrgNode> children) {}
}