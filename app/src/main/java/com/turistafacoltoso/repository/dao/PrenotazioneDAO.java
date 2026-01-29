package com.turistafacoltoso.repository.dao;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.turistafacoltoso.model.Prenotazione;

public interface PrenotazioneDAO {

    // CREATE

    Prenotazione create(Prenotazione p);

    // READ

    List<Prenotazione> findAll();

    Optional<Prenotazione> findById(Integer id);

    Optional<Prenotazione> findByDataCreazione(LocalDateTime localDateTime);

    List<Prenotazione> findByUtenteId(Integer idUtente);

    // UPDATE

    Optional<Prenotazione> update(Prenotazione p);

    // DELETE

    int deleteAll();

    boolean deleteById(Integer id);

}
