package com.turistafacoltoso.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.turistafacoltoso.model.Prenotazione;
import com.turistafacoltoso.service.PrenotazioneDAOService;

import io.javalin.Javalin;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class PrenotazioneController {

    private final PrenotazioneDAOService prenotazioneService;

    public PrenotazioneController() {
        this.prenotazioneService = new PrenotazioneDAOService();
    }

    public void registerRoutes(Javalin app) {
        // CREATE
        app.post("/api/v1/prenotazioni", this::createPrenotazione);

        // READ
        app.get("/api/v1/prenotazioni", this::getAllPrenotazioni);
        app.get("/api/v1/prenotazioni/{id}", this::getPrenotazioneById);
        app.get("/api/v1/prenotazioni/utente/{idUtente}", this::getPrenotazioniByUtente);
        app.get("/api/v1/prenotazioni/latest/utente/{id}", this::getLatestReservationByUtenteId);

        // UPDATE
        app.put("/api/v1/prenotazioni/{id}", this::updatePrenotazione);

        // DELETE
        app.delete("/api/v1/prenotazioni", this::deleteAllPrenotazioni);
        app.delete("/api/v1/prenotazioni/{id}", this::deletePrenotazioneById);
    }

    // ==================== CREATE ====================

    private void createPrenotazione(Context ctx) {
        log.info("POST /api/v1/prenotazioni - Richiesta nuova prenotazione");
        try {
            Prenotazione p = ctx.bodyAsClass(Prenotazione.class);

            Prenotazione created = prenotazioneService.insertPrenotazione(
                    p.getUtenteId(),
                    p.getAbitazioneId(),
                    p.getDataInizio(),
                    p.getDataFine()
            );

            log.info("Prenotazione creata con successo - ID: {}", created.getId());
            ctx.status(HttpStatus.CREATED).json(created);

        } catch (IllegalArgumentException ex) {
            // Gestisce errori di validazione (date errate, abitazione non disponibile nel range)
            log.warn("Validazione fallita in creazione: {}", ex.getMessage());
            ctx.status(HttpStatus.BAD_REQUEST).json(buildErrorResponse(ex.getMessage()));
        } catch (RuntimeException ex) {
            // Gestisce errori come "Abitazione non trovata"
            log.error("Errore durante la creazione: {}", ex.getMessage());
            ctx.status(HttpStatus.NOT_FOUND).json(buildErrorResponse(ex.getMessage()));
        }
    }

    // ==================== READ ====================

    private void getAllPrenotazioni(Context ctx) {
        log.info("GET /api/v1/prenotazioni - Recupero tutte le prenotazioni");
        List<Prenotazione> list = prenotazioneService.getAllPrenotazioni();
        ctx.status(HttpStatus.OK).json(list);
    }

    private void getPrenotazioneById(Context ctx) {
        log.info("GET /api/v1/prenotazioni/{} - Ricerca per ID");
        int id = Integer.parseInt(ctx.pathParam("id"));

        Optional<Prenotazione> p = prenotazioneService.getPrenotazioneById(id);
        if (p.isPresent()) {
            ctx.json(p.get());
        } else {
            ctx.status(HttpStatus.NOT_FOUND).json(buildErrorResponse("Prenotazione non trovata"));
        }
    }

    private void getPrenotazioniByUtente(Context ctx) {
        log.info("GET /api/v1/prenotazioni/utente/{} - Recupero viaggi utente");
        int idUtente = Integer.parseInt(ctx.pathParam("idUtente"));
        ctx.json(prenotazioneService.getPrenotazioniByUtente(idUtente));
    }

    private void getLatestReservationByUtenteId(Context ctx){
        log.info("GET /api/v1/prenotazioni/latest/utente/{id}");
        int idUtente = Integer.parseInt(ctx.pathParam("id"));
        Optional<Prenotazione> p = prenotazioneService.getLastReservation(idUtente);

        if (p.isPresent()) {
            ctx.json(p.get());   
        }else{
            ctx.status(HttpStatus.NOT_FOUND).json(buildErrorResponse("prenotazione non trovata"), getClass());
        }
    }

    // ==================== UPDATE ====================

    private void updatePrenotazione(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        Prenotazione p = ctx.bodyAsClass(Prenotazione.class);
        p.setId(id);

        log.info("PUT /api/v1/prenotazioni/{} - Aggiornamento", id);

        Optional<Prenotazione> updated = prenotazioneService.updatePrenotazione(p);
        if (updated.isPresent()) {
            ctx.status(HttpStatus.OK).json(updated.get());
        } else {
            ctx.status(HttpStatus.NOT_FOUND).json(buildErrorResponse("Impossibile aggiornare: ID non esistente"));
        }
    }

    // ==================== DELETE ====================

    private void deletePrenotazioneById(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        log.info("DELETE /api/v1/prenotazioni/{} - Cancellazione", id);

        if (prenotazioneService.deletePrenotazione(id)) {
            ctx.status(HttpStatus.OK).json(buildSuccessResponse("Prenotazione eliminata"));
        } else {
            ctx.status(HttpStatus.NOT_FOUND).json(buildErrorResponse("Prenotazione non trovata"));
        }
    }

    private void deleteAllPrenotazioni(Context ctx) {
        int count = prenotazioneService.deleteAllPrenotazioni();
        log.warn("DELETE /api/v1/prenotazioni - Eliminate {} prenotazioni", count);
        ctx.json(buildSuccessResponse("Eliminate " + count + " prenotazioni"));
    }

    // ==================== UTILITY ====================

    private Map<String, String> buildErrorResponse(String errorMessage) {
        Map<String, String> response = new HashMap<>();
        response.put("error", errorMessage);
        return response;
    }

    private Map<String, String> buildSuccessResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return response;
    }
}