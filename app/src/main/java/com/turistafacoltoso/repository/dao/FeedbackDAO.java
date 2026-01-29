package com.turistafacoltoso.repository.dao;

import java.util.List;
import java.util.Optional;

import com.turistafacoltoso.model.Feedback;

public interface FeedbackDAO {

    // CREATE

    Feedback create(Feedback f);

    // READ

    List<Feedback> findAll();

    Optional<Feedback> findById(Integer id);

    List<Feedback> findByIdHost(Integer idHost);

    List<Feedback> findByPunteggio(Integer number);

    // UPDATE

    Optional<Feedback> update(Feedback a);

    // DELETE

    int deleteAll();

    boolean deleteById(Integer id);

}
