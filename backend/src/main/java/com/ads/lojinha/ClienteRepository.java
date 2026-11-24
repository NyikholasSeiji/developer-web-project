package com.ads.lojinha;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {

    @Query(value = "select * from cliente where ativo=1 and email=:email and senha=:senha", nativeQuery = true)
    public Optional<Cliente> fazerLogin(String email, String senha);

    @Modifying
    @Transactional
    @Query(value = "update cliente set senha=:senhaTemp, ativo=0 where "+
    " email=:email", nativeQuery=true)
    int resetarSenha(String senhaTemp, String email);

    @Modifying
    @Transactional
    @Query(value = "update cliente set senha=:novaSenha, ativo=1 where "+
    " email=:email and documento=:documento", nativeQuery=true)
    int alterarSenha(String novaSenha, String documento, String email);
}
