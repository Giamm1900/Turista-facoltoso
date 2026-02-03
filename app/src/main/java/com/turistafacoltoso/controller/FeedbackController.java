package com.turistafacoltoso.controller;

import java.util.Optional;

import com.turistafacoltoso.exception.FeedbackNotFoundException;
import com.turistafacoltoso.model.Feedback;
import com.turistafacoltoso.service.FeedbackDAOService;

import io.javalin.Javalin;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class FeedbackController {
    private final FeedbackDAOService feedbackDAOService;

    public FeedbackController() {
        this.feedbackDAOService = new FeedbackDAOService();
    }

    public void registerRoutes(Javalin app) {
        // CREATE
        app.post("/api/v1/feedbacks", this::createFeedback);

        // READ
        app.get("/api/v1/feedbacks", this::getAllFeedback);
        app.get("/api/v1/feedbacks/{id}", this::getFeedbackById);
        app.get("/api/v1/feedbacks/users/{id}", this::getFeedbackByIdUtente);
        app.get("/api/v1/feedbacks/punteggio/{punteggio}", this::getFeedbackByPunteggio);

        // UPDATE
        app.put("/api/v1/feedbacks/{id}", this::updateFeedback);

        // DELETE
        app.delete("/api/v1/feedbacks/{id}", this::deleteFeedbackById);
    }

    private void createFeedback(Context ctx) {
        log.info("POST api/v1/feedback");
        Feedback f = ctx.bodyAsClass(Feedback.class);

        // 2. Valida invece i dati obbligatori
        if (f.getTitolo() == null || f.getPunteggio() <= 0) {
            log.error("Dati feedback mancanti o non validi");
            ctx.status(HttpStatus.BAD_REQUEST);
            return; // Esci senza lanciare eccezioni non gestite
        }

        try {
            Feedback created = feedbackDAOService.insertFeedback(
                    f.getTitolo(),
                    f.getTesto(),
                    f.getPunteggio(),
                    f.getPrenotazioneId(),
                    f.getIdUser(),
                    f.getIdAbitazione()
                );

            ctx.status(HttpStatus.CREATED);
            ctx.json(created);
        } catch (Exception e) {
            log.error("Errore durante l'inserimento: ", e);
            ctx.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void getAllFeedback(Context ctx) {
        log.info("GET api/v1/feedback");
        ctx.json(feedbackDAOService.getAllFeedback());
    }

    private void getFeedbackById(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        log.info("GET api/v1/feedback/{id} - ricerca per id", id);

        Optional<Feedback> f = feedbackDAOService.getFeedbackById(id);

        if (f.isPresent()) {
            ctx.json(f.get());
        } else {
            ctx.status(HttpStatus.NOT_FOUND);
            ctx.json(("Abitazione non trovata"));
        }
    }

    private void getFeedbackByPunteggio(Context ctx) {
        int punteggio = Integer.parseInt(ctx.pathParam("punteggio"));
        log.info("GET api/v1/feedbacks/punteggio/{punteggio} - ricerca per punteggio", punteggio);
        ctx.json(feedbackDAOService.getFeedbackByPunteggio(punteggio));
    }

    private void getFeedbackByIdUtente(Context ctx){
    int idUtente = Integer.parseInt(ctx.pathParam("idUtente"));
    log.info("GET api/v1/feedbacks/users/{id} - ricerca per idUtente", idUtente);
    ctx.json(feedbackDAOService.getFeedbackByIdUtente(idUtente));
    }

    private void updateFeedback(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        Feedback f = ctx.bodyAsClass(Feedback.class);
        f.setId(id);

        log.info("PUT /api/v1/feedbacks/{id} - Aggiornamento", id);

        Optional<Feedback> updated = feedbackDAOService.updateFeedback(f);
        if (updated.isPresent()) {
            ctx.json(updated.get());
            log.info("feedback updated");
        } else {
            ctx.status(HttpStatus.NOT_FOUND);
            throw new FeedbackNotFoundException("Impossibile aggiornare: Feedback non Trovato");
        }
    }

    private void deleteFeedbackById(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        log.info("DELETE /api/v1/feedbacks/{id} - Cancellazione", id);

        if (feedbackDAOService.deleteFeedbackById(id)) {
            ctx.status(HttpStatus.OK);
            ctx.json(("Abitazione eliminata con successo"));
        } else {
            ctx.status(HttpStatus.NOT_FOUND);
            ctx.json(("Abitazione non trovata"));
        }
    }
}
