package com.turistafacoltoso.repository.dao;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.turistafacoltoso.model.Abitazione;

public interface AbitazioneDAO {

    // CREATE

    Abitazione create(Abitazione a);

    // READ

    /**
     * find all Abitations
     * @return
     */
    List<Abitazione> findAll();

    /**
     * Find abitation by 'id'
     * @param id
     * @return
     */
    Optional<Abitazione> findById(Integer id);

    /**
     * find by locals in 'Abitazione'
     * @param number
     * @return
     */
    List<Abitazione> findByNLocali(Integer number);

    /**
     * find by name 
     * @param name
     * @return
     */
    List<Abitazione> findByNomeAbitazione(String name);
    
    List<Abitazione> findByDataDisponibilita(LocalDate dataInizio, LocalDate dataFine);

    List<Abitazione> findByHostId(int idHost);

    Optional<Abitazione> findMostPopularLastMonth();


    // UPDATE

    Optional<Abitazione> update(Abitazione a);

    // DELETE

    int deleteAll();

    boolean deleteById(Integer id);

    boolean deleteByName(String name);

    BigDecimal getMediaPostiLetto();
}
