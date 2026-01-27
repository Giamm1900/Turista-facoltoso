package com.turistafacoltoso.exception;

public class UtenteNotFoundException extends RuntimeException {
    public UtenteNotFoundException(String message) {
        super(message);
    }

    public UtenteNotFoundException(String field, String value) {
        super("User not found with " + field + ": " + value);
    }

    public UtenteNotFoundException(Integer id) {
        super("User not found with id: " + id);
    }
}
