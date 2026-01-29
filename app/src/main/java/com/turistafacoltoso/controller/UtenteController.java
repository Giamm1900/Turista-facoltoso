package com.turistafacoltoso.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.turistafacoltoso.exception.DuplicateUtenteException;
import com.turistafacoltoso.exception.UtenteNotFoundException;
import com.turistafacoltoso.model.Utente;
import com.turistafacoltoso.service.UtenteDAOService;

import io.javalin.Javalin;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class UtenteController {

    private final UtenteDAOService utenteDAOService;

    public UtenteController(){
        utenteDAOService = new UtenteDAOService();
    }

    // Gli endpoints esposti dal mio backend Java
    public void registerRoutes(Javalin app) {
        // CREATE
        app.post("/api/v1/users", this::createUser);

        // READ
        app.get("/api/v1/users", this::getAllUsers);
        app.get("/api/v1/users/{id}", this::getUserById);
        app.get("/api/v1/users/email/{email}", this::getUserByEmail);
        app.get("/api/v1/users/username/{username}", this::getUserByName);

        // UPDATE
        app.put("/api/v1/users/{id}", this::updateUser);

        // DELETE
        app.delete("/api/v1/users", this::deleteAllUsers);
        app.delete("/api/v1/users/{id}", this::deleteUserById);
        app.delete("/api/v1/users/username/{username}", this::deleteUserByName);
    }

    // ==================== CREATE ====================

    private void createUser(Context ctx) {
        log.info("POST /api/v1/users - Richiesta creazione utente");
        Utente utente = ctx.bodyAsClass(Utente.class);

        try {
            utente = utenteDAOService.insertUtente(
                    utente.getNomeUser(),
                    utente.getCognome(),
                    utente.getEmail(),
                    utente.getIndirizzoUser());

            log.info("Utente creato con successo - ID: {}", utente.getId());
            ctx.status(HttpStatus.CREATED);
            ctx.json(utente);

        } catch (DuplicateUtenteException ex) {
            // Eccezione custom: utente già esistente (email o username duplicato)
            log.warn("Creazione fallita - {}", ex.getMessage());
            ctx.status(HttpStatus.CONFLICT); // 409
            ctx.json(buildErrorResponse(ex.getMessage()));
        }
    }

    // ==================== READ ====================

    private void getAllUsers(Context ctx) {
        log.info("GET /api/v1/users - Richiesta lista utenti");
        List<Utente> users = utenteDAOService.getAllUser();
        ctx.status(HttpStatus.OK);
        ctx.json(users);
    }

    private void getUserById(Context ctx) {
        Integer id = Integer.parseInt(ctx.pathParam("id"));
        log.info("GET /api/v1/users/{} - Richiesta utente per ID", id);

        try {
            Utente user = utenteDAOService.getUtenteById(id);
            ctx.status(HttpStatus.OK);
            ctx.json(user);

        } catch (UtenteNotFoundException ex) {
            // Eccezione custom: utente non trovato
            log.warn("Utente non trovato - ID: {}", id);
            ctx.status(HttpStatus.NOT_FOUND); // 404
            ctx.json(buildErrorResponse(ex.getMessage()));
        }
    }

    private void getUserByEmail(Context ctx) {
        String email = ctx.pathParam("email");

        try {
            Utente user = utenteDAOService.getUtenteByEmail(email);
            ctx.status(HttpStatus.OK);
            ctx.json(user);

        } catch (UtenteNotFoundException ex) {
            ctx.status(HttpStatus.NOT_FOUND);
            ctx.json(buildErrorResponse(ex.getMessage()));
        }
    }

    private void getUserByName(Context ctx) {
        String username = ctx.pathParam("username");

        try {
            Utente user = utenteDAOService.getUtenteByName(username);
            ctx.status(HttpStatus.OK);
            ctx.json(user);

        } catch (UtenteNotFoundException ex) {
            ctx.status(HttpStatus.NOT_FOUND);
            ctx.json(buildErrorResponse(ex.getMessage()));
        }
    }

    // ==================== UPDATE ====================

    private void updateUser(Context ctx) {
        Integer id = Integer.parseInt(ctx.pathParam("id"));
        Utente utente = ctx.bodyAsClass(Utente.class);
        utente.setId(id);

        try {
            Utente updatedUser = utenteDAOService.updateUtente(utente);
            ctx.status(HttpStatus.OK);
            ctx.json(updatedUser);

        } catch (UtenteNotFoundException ex) {
            ctx.status(HttpStatus.NOT_FOUND);
            ctx.json(buildErrorResponse(ex.getMessage()));
        }
    }

    // ==================== DELETE ====================

    private void deleteAllUsers(Context ctx) {
        int deletedCount = utenteDAOService.deleteAllUsers();
        ctx.status(HttpStatus.OK);
        ctx.json(buildSuccessResponse("Deleted " + deletedCount + " users"));
    }

    private void deleteUserById(Context ctx) {
        Integer id = Integer.parseInt(ctx.pathParam("id"));

        try {
            utenteDAOService.deleteById(id);
            ctx.status(HttpStatus.OK);
            ctx.json(buildSuccessResponse("User deleted with id: " + id));

        } catch (UtenteNotFoundException ex) {
            ctx.status(HttpStatus.NOT_FOUND);
            ctx.json(buildErrorResponse(ex.getMessage()));
        }
    }

    private void deleteUserByName(Context ctx) {
        String username = ctx.pathParam("username");

        try {
            utenteDAOService.deleteByNameUser(username);
            ctx.status(HttpStatus.OK);
            ctx.json(buildSuccessResponse("User deleted with username: " + username));

        } catch (UtenteNotFoundException ex) {
            ctx.status(HttpStatus.NOT_FOUND);
            ctx.json(buildErrorResponse(ex.getMessage()));
        }
    }

    // ==================== UTILITY ====================

    private Map<String, String> buildErrorResponse(String errorMessage) {
        Map<String, String> error2return = new HashMap<>();
        error2return.put("error", errorMessage);
        return error2return;
    }

    private Map<String, String> buildSuccessResponse(String message) {
        Map<String, String> success2return = new HashMap<>();
        success2return.put("message", message);
        return success2return;
    }

}
