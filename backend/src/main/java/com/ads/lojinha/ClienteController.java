package com.ads.lojinha;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class ClienteController {
    @Autowired
    ClienteRepository bd;

    
    @GetMapping("/api/cliente/{codigo}")
    public Cliente retorna(@PathVariable("codigo") int id){
        if(bd.existsById(id)){
            return bd.findById(id).get();
        } else {
            return new Cliente();
        }
    }

    @PostMapping("/api/cliente")
    public String gravar(@RequestBody Cliente obj){
        bd.save(obj);
        return "Cliente gravado com sucesso! "+ obj.getCodigo();
    }
   
    @PutMapping("/api/cliente")
    public String alterar(@RequestBody Cliente obj){
        if(bd.existsById(obj.getCodigo())){
            bd.save(obj);
            return "Cliente alterado com sucesso! "+ obj.getCodigo();
        } else {
            return "Cliente não encontrado!";
        }
    }

    @DeleteMapping("/api/cliente/{codigo}")
    public String apagar(@PathVariable("codigo") int id){
        bd.deleteById(id);
        return "Cliente removido com sucesso!";
    }

    @PostMapping("/api/cliente/login")
    public Cliente fazerLogin(@RequestBody Cliente obj){
        Optional<Cliente> objCliente = bd.fazerLogin(obj.getEmail(), obj.getSenha());
        if(objCliente.isPresent()){
            return objCliente.get();
        } else {
            return new Cliente();
        }
    }

    @PatchMapping("/api/cliente/resetarSenha")
    public String resetarSenha(@RequestBody Cliente obj){
        String senhaTemp = "Senha1234";
        bd.resetarSenha(senhaTemp, obj.getEmail());
        //TODO ENVIAR EMAIL
        return "Sua senha foi reiniciada, verifique o seu email!";
    }

    @PatchMapping("/api/cliente/alterarSenha")
    public String alterarSenha(@RequestBody Cliente obj){
        bd.alterarSenha(obj.getSenha(), obj.getDocumento(), obj.getEmail());
        //TODO ENVIAR EMAIL
        return "Sua senha foi alterada, verifique o seu email!";
    }


}
