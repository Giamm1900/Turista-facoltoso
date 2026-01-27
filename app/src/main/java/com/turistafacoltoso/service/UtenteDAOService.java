package com.turistafacoltoso.service;

import java.util.List;

import com.turistafacoltoso.exception.DuplicateUtenteException;
import com.turistafacoltoso.exception.UtenteNotFoundException;
import com.turistafacoltoso.model.Utente;
import com.turistafacoltoso.repository.UtenteDAOImpl;
import com.turistafacoltoso.repository.dao.UtenteDAO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class UtenteDAOService {
    // Uso l'interfaccia DAO (non l'implementazione concreta) con Dependency Inversion
    private final UtenteDAO userDAO;

    public UtenteDAOService() {
        userDAO = new UtenteDAOImpl();
    }

    // CREATE
    public Utente insertUtente(String nomeUser, String cognome, String email, String indirizzoUser){

        log.info("Inserimento dati Utente: nomeuser: {}, cognome: {}, email: {}, indirizzo:{}.",nomeUser,cognome,email,indirizzoUser);
        
        Utente u = new Utente(nomeUser,cognome,email,indirizzoUser);

        if (userDAO.findByEmail(email).isPresent()) {
            log.warn("Email già esistente Email:{}",email);
            throw new DuplicateUtenteException("email",email);
        }
        return userDAO.create(u);
    }

    // READ

    public List<Utente> getAllUser(){
        return userDAO.findAll();
    }

    public Utente getUtenteById(Integer id){
        return userDAO.findById(id).orElseThrow(()->new UtenteNotFoundException(id));
    }

    public Utente getUtenteByName(String nameUser){
        return userDAO.findByUsername(nameUser).orElseThrow(()-> new UtenteNotFoundException("nome_user: ",nameUser));
    }
    
    public Utente getUtenteByEmail(String email){
        return userDAO.findByEmail(email).orElseThrow(()-> new UtenteNotFoundException("email:",email));
    }
    
    // UPDATE

    public void updateUtente(Utente u){
        if (userDAO.findById(u.getId()).isEmpty()) {
            throw new UtenteNotFoundException(u.getId());
        }
        userDAO.update(u);
    }

    // DELETE

    public void deleteById(int id){
        if (!userDAO.deleteById(id)) {
            throw new UtenteNotFoundException(id);
        }
    }

    public void deleteByNameUser(String nameUser){
        if (!userDAO.deleteByUsername(nameUser)) {
            throw new UtenteNotFoundException("nameUser", nameUser);
        }
    }
}
