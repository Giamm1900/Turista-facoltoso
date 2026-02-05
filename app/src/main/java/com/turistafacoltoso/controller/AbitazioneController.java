package com.turistafacoltoso.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.turistafacoltoso.model.Abitazione;
import com.turistafacoltoso.service.AbitazioneDAOService;

import io.javalin.Javalin;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class AbitazioneController {
    
    private final AbitazioneDAOService abitazioneService;

    public AbitazioneController() {
        this.abitazioneService = new AbitazioneDAOService();
    }

    public void registerRoutes(Javalin app) {
        // CREATE
        app.post("/api/v1/abitazioni", this::createAbitazione);

        // READ
        app.get("/api/v1/abitazioni", this::getAllAbitazioni);
        app.get("/api/v1/abitazioni/{id}", this::getAbitazioneById);
        app.get("/api/v1/abitazioni/locali/{n}", this::getAbitazioniByLocali);
        app.get("/api/v1/abitazioni/search/disponibilita", this::getAbitazioniDisponibili);
        app.get("/api/v1/abitazioni/hosts/{id}", this::getAbitazioniByHostId);
        app.get("/api/v1/abitazioni/stats/mostPopular",this::getMostPopularAbitazione);
        app.get("/api/v1/abitazioni/postiletto/media",this::getMediaPostiLettoAbitazione);

        // UPDATE
        app.put("/api/v1/abitazioni/{id}", this::updateAbitazione);

        // DELETE
        app.delete("/api/v1/abitazioni/{id}", this::deleteAbitazione);
    }

    // ==================== CREATE ====================

    private void createAbitazione(Context ctx) {
        log.info("POST /api/v1/abitazioni - Richiesta creazione abitazione");
        Abitazione a = ctx.bodyAsClass(Abitazione.class);

        // Verifica se l'host esiste prima di creare l'abitazione
        if (!abitazioneService.checkHostExists(a.getIdHost())) {
            log.warn("Creazione fallita: Host ID {} non trovato", a.getIdHost());
            ctx.status(HttpStatus.BAD_REQUEST);
            ctx.json(buildErrorResponse("Host non trovato con ID: " + a.getIdHost()));
            return;
        }

        Abitazione created = abitazioneService.insertAbitazione(
                a.getNomeAbitazione(), a.getIndirizzoAbitazione(), a.getNLocali(),
                a.getNPostiLetto(), a.getPrezzoPerNotte(), a.getDisponibilitaInizio(),
                a.getDisponibilitaFine(), a.getIdHost()
        );

        ctx.status(HttpStatus.CREATED);
        ctx.json(created);
    }

    // ==================== READ ====================

    private void getAllAbitazioni(Context ctx) {
        log.info("GET /api/v1/abitazioni - Lista completa");
        ctx.json(abitazioneService.getAllAbitazioni());
    }

    public void getAbitazioniByHostId(Context ctx){
        log.info("GET /api/v1/abitazioni/hosts/{id}");
        int id = Integer.parseInt(ctx.pathParam("id"));
        List<Abitazione> la = abitazioneService.findByIdHost(id);
        ctx.json(la);
        
    }

    private void getAbitazioneById(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        log.info("GET /api/v1/abitazioni/{} - Ricerca per ID", id);

        Optional<Abitazione> a = abitazioneService.getAbitazioneById(id);
        if (a.isPresent()) {
            ctx.json(a.get());
        } else {
            ctx.status(HttpStatus.NOT_FOUND);
            ctx.json(buildErrorResponse("Abitazione non trovata"));
        }
    }

    private void getAbitazioniByLocali(Context ctx) {
        int nLocali = Integer.parseInt(ctx.pathParam("n"));
        log.info("GET /api/v1/abitazioni/locali/{} - Ricerca per numero locali", nLocali);
        ctx.json(abitazioneService.getAbitazioniByLocali(nLocali));
    }

    private void getAbitazioniDisponibili(Context ctx) {
        LocalDate inizio = LocalDate.parse(ctx.queryParam("inizio"));
        LocalDate fine = LocalDate.parse(ctx.queryParam("fine"));
        
        log.info("GET /api/v1/abitazioni/search/disponibilita - Range: {} / {}", inizio, fine);
        ctx.json(abitazioneService.getAbitazioniDisponibili(inizio, fine));
    }

    private void getMostPopularAbitazione(Context ctx){
        log.info("controller: GET api/v1/abitazioni/most-popular");
        Optional<Abitazione> a = abitazioneService.getMostPopularAbitazione();
        if (a.isPresent()) {
            ctx.json(a.get());
        }else{
            ctx.status(HttpStatus.NOT_FOUND);
            ctx.json(buildErrorResponse("Abitazione non trovata"));
        }
    }

    private void getMediaPostiLettoAbitazione(Context ctx){
        log.info("GET /api/v1/abitazioni/postiletto/media");
        BigDecimal result = abitazioneService.getMediaPostiLettoAbitazione();
        ctx.json(result, getClass());
    }

    // ==================== UPDATE ====================

    private void updateAbitazione(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        Abitazione a = ctx.bodyAsClass(Abitazione.class);
        a.setId(id); // Assicuriamo che l'ID sia quello del path

        log.info("PUT /api/v1/abitazioni/{} - Aggiornamento", id);
        
        Optional<Abitazione> updated = abitazioneService.updateAbitazione(a);
        if (updated.isPresent()) {
            ctx.json(updated.get());
        } else {
            ctx.status(HttpStatus.NOT_FOUND);
            ctx.json(buildErrorResponse("Impossibile aggiornare: abitazione non esistente"));
        }
    }

    // ==================== DELETE ====================

    private void deleteAbitazione(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        log.info("DELETE /api/v1/abitazioni/{} - Cancellazione", id);

        if (abitazioneService.deleteAbitazione(id)) {
            ctx.status(HttpStatus.OK);
            ctx.json(buildSuccessResponse("Abitazione eliminata con successo"));
        } else {
            ctx.status(HttpStatus.NOT_FOUND);
            ctx.json(buildErrorResponse("Abitazione non trovata"));
        }
    }

    // ==================== UTILITY ====================

    private Map<String, String> buildErrorResponse(String errorMessage) {
        Map<String, String> error = new HashMap<>();
        error.put("error", errorMessage);
        return error;
    }

    private Map<String, String> buildSuccessResponse(String message) {
        Map<String, String> success = new HashMap<>();
        success.put("message", message);
        return success;
    }
}
