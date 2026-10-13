package id.go.sireva.tahun;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TahunService {
    private final TahunRepository repository;

    public TahunService(TahunRepository repository) {
        this.repository = repository;
    }

    public List<Tahun> find(Long id) {
        if (id == null) {
            return repository.findAll();
        }
        return repository.findById(id).map(List::of).orElseGet(List::of);
    }

    public List<Tahun> save(TahunRequest request) {
        if (request.tahun() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Field tahun wajib diisi.");
        }

        var saved = request.id() == null
                ? repository.create(request)
                : repository.update(request);
        return saved.map(List::of).orElseGet(List::of);
    }

    public List<Tahun> delete(Long id) {
        if (id == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID is required");
        }
        return repository.deleteById(id).map(List::of).orElseGet(List::of);
    }
}