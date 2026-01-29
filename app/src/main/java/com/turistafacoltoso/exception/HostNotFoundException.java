package com.turistafacoltoso.exception;

public class HostNotFoundException extends RuntimeException {
    public HostNotFoundException(String message) {
        super(message);
    }

    public HostNotFoundException(Integer id) {
        super("Host non trovato con id: " + id);
    }

    public HostNotFoundException(String field, String value) {
        super("Host not found with " + field + ": " + value);
    }
}
