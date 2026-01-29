package com.turistafacoltoso.exception;

public class DuplicateHostException extends RuntimeException {
    public DuplicateHostException(String message) {
        super(message);
    }

    public DuplicateHostException(Integer idUtente) {
        super("Esiste già un host associato all'utente con id: " + idUtente);
    }
}
