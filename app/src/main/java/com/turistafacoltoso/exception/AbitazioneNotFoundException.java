package com.turistafacoltoso.exception;

public class AbitazioneNotFoundException extends RuntimeException {
    public AbitazioneNotFoundException(String message) {
        super(message);
    }

    public AbitazioneNotFoundException(Integer id) {
        super("Abitazione non trovato con id: " + id);
    }
}
