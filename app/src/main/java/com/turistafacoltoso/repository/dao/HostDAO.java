package com.turistafacoltoso.repository.dao;

import java.util.List;
import java.util.Optional;

import com.turistafacoltoso.model.Host;

public interface HostDAO {
    
    // CREATE

    Host create(Host p);

    // READ

    List<Host> findAll();

    Optional<Host> findById(Integer id);

    // UPDATE

    Optional<Host> update(Host p);

    // DELETE

    int deleteAll();

    boolean deleteById(Integer id);
}
