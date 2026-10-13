package id.go.sireva.visimisitujuan;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class VisiMisiTujuanService {
    private final VisiRepository visiRepository;
    private final MisiRepository misiRepository;
    private final TujuanRepository tujuanRepository;

    public VisiMisiTujuanService(VisiRepository visiRepository, MisiRepository misiRepository,
            TujuanRepository tujuanRepository) {
        this.visiRepository = visiRepository;
        this.misiRepository = misiRepository;
        this.tujuanRepository = tujuanRepository;
    }

    public List<Visi> findVisi(Long id) {
        return visiRepository.find(id);
    }

    public List<Visi> saveVisi(VisiRequest request) {
        if (request.visiText() == null || request.visiText().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "visiText wajib diisi.");
        }
        return visiRepository.save(request);
    }

    public void deleteVisi(Long id) {
        requireId(id);
        visiRepository.delete(id);
    }

    public List<Misi> findMisi(Long id) {
        return misiRepository.find(id);
    }

    public List<Misi> saveMisi(MisiRequest request) {
        if (request.misiText() == null || request.misiText().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "misiText wajib diisi.");
        }
        return misiRepository.save(request);
    }

    public List<Misi> deleteMisi(Long id) {
        requireId(id);
        return misiRepository.delete(id);
    }

    public List<Tujuan> findTujuan(Long id) {
        return tujuanRepository.find(id);
    }

    public List<Tujuan> saveTujuan(TujuanRequest request) {
        if (request.tujuanText() == null || request.tujuanText().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "tujuanText wajib diisi.");
        }
        return tujuanRepository.save(request);
    }

    public List<Tujuan> deleteTujuan(Long id) {
        requireId(id);
        return tujuanRepository.delete(id);
    }

    private void requireId(Long id) {
        if (id == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID is required");
        }
    }

    public record VisiResponse(List<Visi> data) {}
}