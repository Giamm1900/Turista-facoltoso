package com.turistafacoltoso.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.turistafacoltoso.model.Prenotazione;
import com.turistafacoltoso.repository.dao.PrenotazioneDAO;

public class PrenotazioneDAOImpl implements PrenotazioneDAO {

    @Override
    public Prenotazione create(Prenotazione p) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'create'");
    }

    @Override
    public List<Prenotazione> findAll() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findAll'");
    }

    @Override
    public Optional<Prenotazione> findById(Integer id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findById'");
    }

    @Override
    public Optional<Prenotazione> findByDataCreazione(LocalDateTime localDateTime) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findByDataCreazione'");
    }

    @Override
    public Optional<Prenotazione> findByUtenteId(Integer idUtente) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findByUtenteId'");
    }

    @Override
    public Optional<Prenotazione> update(Prenotazione p) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'update'");
    }

    @Override
    public int deleteAll() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteAll'");
    }

    @Override
    public boolean deleteById(Integer id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteById'");
    }
    
}
