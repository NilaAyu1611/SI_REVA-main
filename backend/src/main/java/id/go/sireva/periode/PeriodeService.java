package id.go.sireva.periode;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PeriodeService {
    private final PeriodeRepository repository;

    public PeriodeService(PeriodeRepository repository) {
        this.repository = repository;
    }

    public List<Periode> find(Long id) {
        return id == null ? repository.findAll() : repository.findById(id);
    }

    public List<Periode> save(PeriodeRequest request) {
        var saved = request.id() == null ? repository.create(request) : repository.update(request);
        return saved.map(List::of).orElseGet(List::of);
    }

    public List<Periode> delete(Long id) {
        if (id == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID is required");
        }
        return repository.deleteById(id);
    }
}