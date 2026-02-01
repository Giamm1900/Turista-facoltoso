package com.turistafacoltoso.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.turistafacoltoso.exception.DuplicateHostException;
import com.turistafacoltoso.exception.HostNotFoundException;
import com.turistafacoltoso.model.Host;
import com.turistafacoltoso.service.HostDAOService;

import io.javalin.Javalin;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class HostController {

    private final HostDAOService hostService;

    public HostController() {
        this.hostService = new HostDAOService();
    }

    public void registerRoutes(Javalin app) {
        // CREATE
        app.post("/api/v1/hosts", this::createHost);

        // READ
        app.get("/api/v1/hosts", this::getAllHosts);
        app.get("/api/v1/hosts/{id}", this::getHostById);
        app.get("/api/v1/top-hosts",this::getTopHosts);

        // UPDATE
        app.put("/api/v1/hosts/{id}", this::updateHost);

        // DELETE
        app.delete("/api/v1/hosts", this::deleteAllHosts);
        app.delete("/api/v1/hosts/{id}", this::deleteHostById);
    }

    // ==================== CREATE ====================

    private void createHost(Context ctx) {
        log.info("POST /api/v1/hosts - Richiesta creazione host");
        Host host = ctx.bodyAsClass(Host.class);

        try {
            Host createdHost = hostService.createHost(host);
            ctx.status(HttpStatus.CREATED);
            ctx.json(createdHost);

        } catch (DuplicateHostException ex) {
            log.warn("Creazione host fallita - {}", ex.getMessage());
            ctx.status(HttpStatus.CONFLICT);
            ctx.json(buildErrorResponse(ex.getMessage()));

        } catch (IllegalArgumentException ex) {
            ctx.status(HttpStatus.BAD_REQUEST);
            ctx.json(buildErrorResponse(ex.getMessage()));
        }
    }

    // ==================== READ ====================

    private void getAllHosts(Context ctx) {
        log.info("GET /api/v1/hosts - Richiesta lista host");
        List<Host> hosts = hostService.getAllHosts();
        ctx.status(HttpStatus.OK);
        ctx.json(hosts);
    }

    private void getHostById(Context ctx) {
        Integer id = Integer.parseInt(ctx.pathParam("id"));
        log.info("GET /api/v1/hosts/{} - Richiesta host per ID", id);

        try {
            Optional<Host> host = hostService.getHostById(id);
            ctx.status(HttpStatus.OK);
            ctx.json(host);

        } catch (HostNotFoundException ex) {
            ctx.status(HttpStatus.NOT_FOUND);
            ctx.json(buildErrorResponse(ex.getMessage()));
        }
    }

    private void getTopHosts(Context ctx){
        log.info("GET /api/v1/top-hosts");
        Map<String,Integer> hosts = hostService.findTopHostsLastMonthS();
        if (hosts.isEmpty()) {
            log.warn("nessun host trovato");
        }
        ctx.status(HttpStatus.OK);
        ctx.json(hosts);
    }

    // ==================== UPDATE ====================

    private void updateHost(Context ctx) {
        Integer id = Integer.parseInt(ctx.pathParam("id"));
        Host host = ctx.bodyAsClass(Host.class);
        host.setId(id);

        try {
            Host updatedHost = hostService.updateHost(host);
            ctx.status(HttpStatus.OK);
            ctx.json(updatedHost);

        } catch (HostNotFoundException ex) {
            ctx.status(HttpStatus.NOT_FOUND);
            ctx.json(buildErrorResponse(ex.getMessage()));

        } catch (IllegalArgumentException ex) {
            ctx.status(HttpStatus.BAD_REQUEST);
            ctx.json(buildErrorResponse(ex.getMessage()));
        }
    }

    // ==================== DELETE ====================

    private void deleteAllHosts(Context ctx) {
        int deletedCount = hostService.deleteAllHosts();
        ctx.status(HttpStatus.OK);
        ctx.json(buildSuccessResponse("Deleted " + deletedCount + " hosts"));
    }

    private void deleteHostById(Context ctx) {
        Integer id = Integer.parseInt(ctx.pathParam("id"));

        try {
            hostService.deleteHostById(id);
            ctx.status(HttpStatus.OK);
            ctx.json(buildSuccessResponse("Host deleted with id: " + id));

        } catch (HostNotFoundException ex) {
            ctx.status(HttpStatus.NOT_FOUND);
            ctx.json(buildErrorResponse(ex.getMessage()));

        } catch (IllegalArgumentException ex) {
            ctx.status(HttpStatus.BAD_REQUEST);
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
