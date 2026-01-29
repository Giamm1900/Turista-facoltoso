package com.turistafacoltoso.exception;

public class HostNotFoundException extends RuntimeException {
    public HostNotFoundException(String message) {
        super(message);
    }

    public HostNotFoundException(Integer id) {
        super("Host non trovato con id: " + id);
    }
}
