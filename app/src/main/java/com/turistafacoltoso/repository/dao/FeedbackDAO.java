package com.turistafacoltoso.repository.dao;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.turistafacoltoso.model.Feedback;

public interface FeedbackDAO {

    // CREATE

    Feedback create(Feedback f);

    // READ

    List<Feedback> findAll();

    Optional<Feedback> findById(Integer id);

    Optional<Feedback> findByIdHost(Integer idHost);

    Optional<Feedback> findByPunteggio(Integer number);

    // UPDATE

    Optional<Feedback> update(Feedback a);

    // DELETE

    int deleteAll();

    boolean deleteById(Integer id);

}
