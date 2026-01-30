package com.turistafacoltoso.repository.dao;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.turistafacoltoso.model.Utente;

public interface UtenteDAO {

    // CREATE

    Utente create(Utente u);

    // READ

    List<Utente> findAll();

    Optional<Utente> findById(Integer id);

    Optional<Utente> findByEmail(String email);

    Optional<Utente> findByUsername(String name);

    Map<String,Integer> findTopUsersByDaysLastMonth();

    // UPDATE

    Utente update(Utente u);

    // DELETE

    int deleteAll();

    boolean deleteById(Integer id);

    boolean deleteByUsername(String name);
}
