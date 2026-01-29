package com.turistafacoltoso.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.turistafacoltoso.model.Abitazione;
import com.turistafacoltoso.repository.dao.AbitazioneDAO;

public class AbitazioneDAOImpl implements AbitazioneDAO{

    @Override
    public Abitazione create(Abitazione a) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'create'");
    }

    @Override
    public List<Abitazione> findAll() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findAll'");
    }

    @Override
    public Optional<Abitazione> findById(Integer id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findById'");
    }

    @Override
    public Optional<Abitazione> findByNLocali(Integer number) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findByNLocali'");
    }

    @Override
    public Optional<Abitazione> findByNomeAbitazione(String name) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findByNomeAbitazione'");
    }

    @Override
    public Optional<Abitazione> findByDataDisponibilita(LocalDate dataInizio, LocalDate dataFine) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findByDataDisponibilita'");
    }

    @Override
    public Optional<Abitazione> update(Abitazione a) {
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

    @Override
    public boolean deleteByName(String name) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteByName'");
    }
    
}
