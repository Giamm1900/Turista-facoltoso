package com.turistafacoltoso.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.turistafacoltoso.exception.PrenotazioneNotFoundException;
import com.turistafacoltoso.model.Abitazione;
import com.turistafacoltoso.model.Prenotazione;
import com.turistafacoltoso.repository.PrenotazioneDAOImpl;
import com.turistafacoltoso.repository.dao.PrenotazioneDAO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class PrenotazioneDAOService {
    private final PrenotazioneDAO prenotazioneDAO;
    private final AbitazioneDAOService abitazioneService;

    public PrenotazioneDAOService() {
        this.prenotazioneDAO = new PrenotazioneDAOImpl();
        this.abitazioneService = new AbitazioneDAOService();
    }

    public Prenotazione insertPrenotazione(int idUtente, int idAbitazione, LocalDate dataInizio, LocalDate dataFine) {
        log.info("Richiesta prenotazione: Utente {} per Abitazione {} [{} / {}]", idUtente, idAbitazione, dataInizio, dataFine);

        if (dataFine.isBefore(dataInizio) || dataFine.isEqual(dataInizio)) {
            throw new IllegalArgumentException("La data di fine deve essere successiva a quella di inizio.");
        }
        if (dataInizio.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Non è possibile prenotare una data nel passato.");
        }

        Optional<Abitazione> abitazioneOpt = abitazioneService.getAbitazioneById(idAbitazione);
        if (abitazioneOpt.isEmpty()) {
            throw new RuntimeException("L'abitazione selezionata non esiste.");
        }

        Abitazione ab = abitazioneOpt.get();
        if (dataInizio.isBefore(ab.getDisponibilitaInizio()) || dataFine.isAfter(ab.getDisponibilitaFine())) {
            throw new IllegalArgumentException("L'abitazione non è disponibile nel periodo richiesto. Disponibilità: " 
                    + ab.getDisponibilitaInizio() + " - " + ab.getDisponibilitaFine());
        }
        Prenotazione p = new Prenotazione();
        p.setUtenteId(idUtente);
        p.setAbitazioneId(idAbitazione);
        p.setDataInizio(dataInizio);
        p.setDataFine(dataFine);
        p.setCreatedAt(LocalDateTime.now());

        return prenotazioneDAO.create(p);
    }

    // ==================== READ ====================

    public List<Prenotazione> getAllPrenotazioni() {
        if (prenotazioneDAO.findAll().isEmpty()) {
            log.error("Error method getAllPrenotazioni");
            throw new PrenotazioneNotFoundException("Prenotazione non trovata");
        }
        return prenotazioneDAO.findAll();
    }

    public Optional<Prenotazione> getPrenotazioneById(int id) {
        if (id <= 0) {
            log.error("Error getPrenotazioneById");
            throw new PrenotazioneNotFoundException("l'id non può essere nullo o 0");
        }
        return prenotazioneDAO.findById(id);
    }

    public List<Prenotazione> getPrenotazioniByUtente(int idUtente) {
        if (idUtente <= 0) {
            log.error("Error getPrenotazioniByUtente");
            throw new PrenotazioneNotFoundException("l'idUtente non può essere nullo o 0");
        }
        return prenotazioneDAO.findByUtenteId(idUtente);
    }

    public Optional<Prenotazione> getLastReservation(int idUtente){
        if (idUtente<= 0) {
            throw new PrenotazioneNotFoundException("errore ultima prenotazione non trovata id deve essere maggiore di 0");
        }
        return prenotazioneDAO.findLatestByUtenteId(idUtente);
    }

    // ==================== UPDATE ====================

    public Optional<Prenotazione> updatePrenotazione(Prenotazione p) {
        if (p.getId() <= 0) {
            log.warn("Tentativo di update su prenotazione senza ID valido");
            return Optional.empty();
        }
        return prenotazioneDAO.update(p);
    }

    // ==================== DELETE ====================

    public boolean deletePrenotazione(int id) {
        log.info("Eliminazione prenotazione ID: {}", id);
        return prenotazioneDAO.deleteById(id);
    }

    public int deleteAllPrenotazioni() {
        log.warn("Cancellazione di tutte le prenotazioni in corso!");
        return prenotazioneDAO.deleteAll();
    }
}
