package com.turistafacoltoso.service;

import java.util.List;
import java.util.Optional;

import com.turistafacoltoso.exception.FeedbackNotFoundException;
import com.turistafacoltoso.model.Feedback;
import com.turistafacoltoso.repository.FeedbackDAOImpl;
import com.turistafacoltoso.repository.dao.FeedbackDAO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class FeedbackDAOService {
    private final FeedbackDAO feedbackDAO;
    private final HostDAOService hostDAOService;
    private final PrenotazioneDAOService prenotazioneDAOService;  

    public FeedbackDAOService(){
        this.feedbackDAO = new FeedbackDAOImpl();
        this.hostDAOService = new HostDAOService();
        this.prenotazioneDAOService = new PrenotazioneDAOService();
    }

    /**
     * inserimento di un feedback
     * 
     */
    public Feedback insertFeedback(String titolo, String testo, int punteggio, int prenotazioneId, int idHost){
        log.info(
            "inserimento feedback - titolo: {}, testo: {}, punteggio: {}, prenotazioneid: {}, idHost: {}"
            ,titolo,testo,punteggio,prenotazioneId,idHost);
        if (punteggio < 1 || punteggio > 5) throw new IllegalArgumentException("Punteggio non valido");
        Feedback f = new Feedback(titolo,testo,punteggio,prenotazioneId,idHost);
        return feedbackDAO.create(f);
    }

    /**
     * 
     * ricerca di tutti i feedback
     */
    public List<Feedback> getAllFeedback(){
        log.info("ricerca tutti i feedback nel sistema");
        return feedbackDAO.findAll();
    }

    /**
     * ricerca di un feedback per id
     */
    public Optional<Feedback> getFeedbackById(int id){
        log.info("ricerca feedback by id");
        if (id <= 0) {
            log.error("l'id non può essere 0 o null");
            throw new FeedbackNotFoundException("feedback non trovato con id: "+id);
        }
        return feedbackDAO.findById(id);
    }

    /**
     * 
     *  ricerca feedback by idHost
     */
    public List<Feedback> getFeedbackByIdHost(int idHost){
        log.info("ricerca feedback by idHost");
        if (idHost <= 0) {
            log.error("l'id non può essere 0 o null");
            throw new FeedbackNotFoundException("feedback non trovato: "+idHost);
        }
        return feedbackDAO.findByIdHost(idHost);
    }

    /**
     * 
     * ricerca di un feedback per punteggio
     * @param punteggio
     * 
     */
    public List<Feedback> getFeedbackByPunteggio(int punteggio){
        if (punteggio < 1 || punteggio > 5) {
            log.error("il punteggio non può essere 0:",punteggio);
            throw new IllegalArgumentException("punteggio deve essere compreso tra 1 e 5");
        }
        return feedbackDAO.findByPunteggio(punteggio);
    }

    /**
     * 
     * update di un feedback
     * @return
     */
    public Optional<Feedback> updateFeedback(Feedback f ){
        log.info("Update feedback",f);
        if (f.getId()<= 0) {
            log.error("l'id non può essere 0: ",f.getId());
            throw new IllegalArgumentException("errore update feedback per id");
        }
        return feedbackDAO.update(f);
    }


    /**
     * cancellazione di un feedback per id
     * @param id
     * @return
     */
    public boolean deleteFeedbackById(int id){
        log.info("delete di un feedback per id");

        Optional<Feedback> feedback = feedbackDAO.findById(id);
        if (feedback.isEmpty()) {
            log.warn("Impossibile eliminare: feedback {} non trovato", id);
            return false;
        }
        return feedbackDAO.deleteById(id);
    }

}

