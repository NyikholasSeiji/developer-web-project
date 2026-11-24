package com.ads.lojinha;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class ProdutoController {
    @Autowired
    ProdutoRepository bd;


    @GetMapping("/api/produto/{codigo}")
    public Produto retornaProduto(@PathVariable("codigo") int id){
        if(bd.existsById(id)){
            return bd.findById(id).get();
        } else {
            return new Produto();
        }
    }

    @PostMapping("/api/produto")
    public String gravar(@RequestBody Produto obj){
        bd.save(obj);
        return "Produto gravado com sucesso! "+ obj.getCodigo();
    }
   
    @PutMapping("/api/produto")
    public String alterar(@RequestBody Produto obj){
        if(bd.existsById(obj.getCodigo())){
            bd.save(obj);
            return "Produto alterado com sucesso! "+ obj.getCodigo();
        } else {
            return "produto não encontrado!";
        }
    }

    @DeleteMapping("/api/produto/{codigo}")
    public String apagar(@PathVariable("codigo") int id){
        bd.deleteById(id);
        return "Produto removido com sucesso!";
    }

    @GetMapping("/api/produtos")
    public List<Produto> listar(){
        return bd.findAll();
    }

    @GetMapping("/api/produto/vitrine") 
    public List<Produto> carregaVitrine(){
        return bd.carregaVitrine();
    }

    @GetMapping("/api/produto/busca/{termo}")
    public List<Produto> fazerBusca(@PathVariable("termo") String t){
        return bd.fazerBusca("%"+ t +"%");
    }
}
