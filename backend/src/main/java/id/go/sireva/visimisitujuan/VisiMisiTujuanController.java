package id.go.sireva.visimisitujuan;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class VisiMisiTujuanController {
    private final VisiMisiTujuanService service;

    public VisiMisiTujuanController(VisiMisiTujuanService service) {
        this.service = service;
    }

    @GetMapping("/visi")
    public VisiMisiTujuanService.VisiResponse findVisi(@RequestParam(required = false) Long id) {
        return new VisiMisiTujuanService.VisiResponse(service.findVisi(id));
    }

    @PostMapping("/visi")
    public VisiMisiTujuanService.VisiResponse createVisi(@RequestBody VisiRequest request) {
        return new VisiMisiTujuanService.VisiResponse(service.saveVisi(request));
    }

    @PutMapping("/visi")
    public VisiMisiTujuanService.VisiResponse updateVisi(@RequestBody VisiRequest request) {
        return new VisiMisiTujuanService.VisiResponse(service.saveVisi(request));
    }

    @DeleteMapping("/visi")
    public SuccessResponse deleteVisi(@RequestBody VisiRequest request) {
        service.deleteVisi(request.id());
        return new SuccessResponse(true);
    }

    @GetMapping("/misi")
    public List<Misi> findMisi(@RequestParam(required = false) Long id) {
        return service.findMisi(id);
    }

    @PostMapping("/misi")
    public List<Misi> createMisi(@RequestBody MisiRequest request) {
        return service.saveMisi(request);
    }

    @PutMapping("/misi")
    public List<Misi> updateMisi(@RequestBody MisiRequest request) {
        return service.saveMisi(request);
    }

    @DeleteMapping("/misi")
    public List<Misi> deleteMisi(@RequestBody MisiRequest request) {
        return service.deleteMisi(request.id());
    }

    @GetMapping("/tujuan")
    public List<Tujuan> findTujuan(@RequestParam(required = false) Long id) {
        return service.findTujuan(id);
    }

    @PostMapping("/tujuan")
    public List<Tujuan> createTujuan(@RequestBody TujuanRequest request) {
        return service.saveTujuan(request);
    }

    @PutMapping("/tujuan")
    public List<Tujuan> updateTujuan(@RequestBody TujuanRequest request) {
        return service.saveTujuan(request);
    }

    @DeleteMapping("/tujuan")
    public List<Tujuan> deleteTujuan(@RequestBody TujuanRequest request) {
        return service.deleteTujuan(request.id());
    }

    public record SuccessResponse(boolean success) {}
}