package com.turistafacoltoso.repository.dao;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.turistafacoltoso.model.Host;

public interface HostDAO {
    
    // CREATE

    Host create(Host p);

    // READ

    List<Host> findAll();

    Optional<Host> findById(Integer id);

    Map<String, Integer> findTopHostsLastMonth();

    Map<String, Integer> findAllSuperHosts();

    // UPDATE

    Optional<Host> update(Host p);

    // DELETE

    int deleteAll();

    boolean deleteById(Integer id);
}
