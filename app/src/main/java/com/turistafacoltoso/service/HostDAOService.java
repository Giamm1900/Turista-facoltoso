package com.turistafacoltoso.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.turistafacoltoso.exception.DuplicateHostException;
import com.turistafacoltoso.exception.HostNotFoundException;
import com.turistafacoltoso.model.Abitazione;
import com.turistafacoltoso.model.Host;
import com.turistafacoltoso.repository.HostDAOImpl;
import com.turistafacoltoso.repository.dao.HostDAO;
public class HostDAOService {
    private final HostDAO hostDAO;
    private final UtenteDAOService utenteService;

    public HostDAOService() {
        hostDAO = new HostDAOImpl();
        utenteService = new UtenteDAOService();
    }

    // ==================== CREATE ====================

    public Host createHost(Host host) {
        if (host == null) {
            throw new IllegalArgumentException("Host non può essere null");
        }
        if (host.getIdUtente() <= 0) {
            throw new IllegalArgumentException("ID utente non valido");
        }

        // Controllo duplicato: un utente può essere host una sola volta
        Optional<Host> existingHost = hostDAO.findById(host.getIdUtente());
        if (existingHost.isPresent()) {
            throw new DuplicateHostException(host.getIdUtente());
        }

        return hostDAO.create(host);
    }

    // ==================== READ ====================

    public List<Host> getAllHosts() {
        return hostDAO.findAll();
    }

    public Optional<Host> getHostById(int id) {
        return hostDAO.findById(id); // Assumendo che il DAO dell'Host restituisca un Optional
    }

    public Map<String, Integer> findTopHostsLastMonthS(){
        return hostDAO.findTopHostsLastMonth();
    }

    // ==================== UPDATE ====================

    public Host updateHost(Host host) {
        if (host == null || host.getId() <= 0) {
            throw new IllegalArgumentException("Host o ID non valido");
        }

        // Aggiorno i dati dell'utente tramite il suo service
        utenteService.updateUtente(host);

        // Aggiorno la tabella host
        return hostDAO.update(host)
                .orElseThrow(() -> new HostNotFoundException(host.getId()));
    }

    // ==================== DELETE ====================

    public int deleteAllHosts() {
        return hostDAO.deleteAll();
    }

    public void deleteHostById(Integer id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID non valido");
        }

        boolean deleted = hostDAO.deleteById(id);
        if (!deleted) {
            throw new HostNotFoundException(id);
        }
    }
}
