package id.go.sireva.sumberdana;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SumberDanaService {
    private final SumberDanaRepository repository;

    public SumberDanaService(SumberDanaRepository repository) {
        this.repository = repository;
    }

    public List<SumberDana> find(Long id) {
        return id == null ? repository.findAll() : repository.findById(id);
    }

    public List<SumberDana> save(SumberDanaRequest request) {
        if (request.nama() == null || request.nama().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Field nama wajib diisi.");
        }
        return repository.save(request);
    }

    public List<SumberDana> delete(Long id) {
        if (id == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID is required");
        }
        return repository.deleteById(id);
    }
}