package com.turistafacoltoso.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.turistafacoltoso.exception.AbitazioneNotFoundException;
import com.turistafacoltoso.model.Abitazione;
import com.turistafacoltoso.repository.AbitazioneDAOImpl;
import com.turistafacoltoso.repository.dao.AbitazioneDAO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class AbitazioneDAOService {
    private final AbitazioneDAO abitazioneDAO;
    private final HostDAOService hostDAOService;

    public AbitazioneDAOService() {
        this.abitazioneDAO = new AbitazioneDAOImpl();
        this.hostDAOService = new HostDAOService();
    }

    /**
     * Inserimento di un abitazione tramite campi
     */
    public Abitazione insertAbitazione(String nomeAbitazione, String indirizzoAbitazione, int nLocali, int nPostiLetto,
            BigDecimal prezzoPerNotte, LocalDate disponibilitaInizio, LocalDate disponibilitaFine, int idHost) {
        log.info(
                "inserimento abitazione - nome : {}, indirizzo : {}, numero locali : {}, numero posti letto : {}, prezzo Per Notte : {}, disponibilitaInizio : {}, disponibilitaFine : {}, idHost : {}",
                nomeAbitazione, indirizzoAbitazione, nLocali, nPostiLetto, prezzoPerNotte, disponibilitaInizio,
                disponibilitaFine, idHost);

        validaDate(disponibilitaInizio, disponibilitaFine);
        Abitazione a = new Abitazione(nomeAbitazione, indirizzoAbitazione, nLocali, nPostiLetto, prezzoPerNotte,
                disponibilitaInizio, disponibilitaFine, idHost);
        return abitazioneDAO.create(a);
    }

    /**
     * 
     * Ricerca di tutte le abitazioni presenti
     */
    public List<Abitazione> getAllAbitazioni() {
        log.info("Recupero di tutte le abitazioni");
        if (abitazioneDAO.findAll().isEmpty()) {
            log.error("Error method getAllAbitazioni");
            throw new AbitazioneNotFoundException("abitazioni non trovate {}");
        }
        return abitazioneDAO.findAll();
    }

    /**
     * Ricerca un'abitazione per ID.
     */
    public Optional<Abitazione> getAbitazioneById(int id) {
        log.info("Ricerca abitazione con ID: {}", id);
        return abitazioneDAO.findById(id);
    }

    public Optional<Abitazione> getMostPopularAbitazione(){
        log.info("Service: ricerca abitazione più popoloare dell'ultimo mese");
        return abitazioneDAO.findMostPopularLastMonth();
    }

    /**
     * Ricerca abitazioni per numero di locali.
     */
    public List<Abitazione> getAbitazioniByLocali(int nLocali) {
        log.info("Ricerca abitazioni con {} locali", nLocali);
        if (nLocali <= 0) {
            log.error("non ci sono abitazioni con 0 posti");
            throw new AbitazioneNotFoundException("le abitazioni non possono avere 0 posti");
        }
        return abitazioneDAO.findByNLocali(nLocali);
    }

    /**
     * Ricerca abitazioni disponibili in un determinato range temporale.
     */
    public List<Abitazione> getAbitazioniDisponibili(LocalDate inizio, LocalDate fine) {
        log.info("Ricerca disponibilità tra {} e {}", inizio, fine);
        return abitazioneDAO.findByDataDisponibilita(inizio, fine);
    }

    public List<Abitazione> findByIdHost(int idHost){
        return abitazioneDAO.findByHostId(idHost);
    }

    /**
     * Aggiorna i dati di un'abitazione esistente.
     */
    public Optional<Abitazione> updateAbitazione(Abitazione a) {
        if (a.getId() <= 0) {
            log.warn("Tentativo di update su abitazione senza ID");
            return Optional.empty();
        }
        log.info("Aggiornamento abitazione ID: {}", a.getId());
        return abitazioneDAO.update(a);
    }

    /**
     * Cancella un'abitazione tramite ID.
     */
    public boolean deleteAbitazione(int id) {
        log.info("Richiesta cancellazione abitazione ID: {}", id);
        return abitazioneDAO.deleteById(id);
    }

    /**
     * Metodo di utilità per verificare se l'host esiste prima di procedere
     * (integrazione con HostService)
     */
    public boolean checkHostExists(int idHost) {
        return hostDAOService.getHostById(idHost).isPresent();
    }

    private void validaDate(LocalDate inizio, LocalDate fine) {
        if (inizio == null || fine == null) {
            throw new IllegalArgumentException("Le date di disponibilità non possono essere nulle");
        }
        if (fine.isBefore(inizio)) {
            throw new IllegalArgumentException("La data di fine disponibilità (" + fine
                    + ") non può essere precedente alla data di inizio (" + inizio + ")");
        }
        if (inizio.isBefore(LocalDate.now())) {
            log.warn("Inserimento abitazione con data inizio nel passato: {}", inizio);
            // Qui decidi tu se bloccare o solo loggare
        }
    }
}
