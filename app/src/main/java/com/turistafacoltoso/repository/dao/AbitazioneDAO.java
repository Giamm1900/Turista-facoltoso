package com.turistafacoltoso.repository.dao;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.turistafacoltoso.model.Abitazione;

public interface AbitazioneDAO {

    // CREATE

    Abitazione create(Abitazione a);

    // READ

    List<Abitazione> findAll();

    Optional<Abitazione> findById(Integer id);

    Optional<Abitazione> findByNLocali(Integer number);

    Optional<Abitazione> findByNomeAbitazione(String name);

    Optional<Abitazione> findByDataDisponibilita(LocalDate dataInizio,LocalDate dataFine);

    // UPDATE

    Optional<Abitazione> update(Abitazione a);

    // DELETE

    int deleteAll();

    boolean deleteById(Integer id);

    boolean deleteByName(String name);
}
