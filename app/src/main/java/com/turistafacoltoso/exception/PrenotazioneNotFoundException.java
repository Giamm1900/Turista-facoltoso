package com.turistafacoltoso.exception;

public class PrenotazioneNotFoundException extends RuntimeException{
    public PrenotazioneNotFoundException(String message) {
        super(message);
    }

    public PrenotazioneNotFoundException(Integer id) {
        super("Prenotazione non trovato con id: " + id);
    }
    public PrenotazioneNotFoundException(String field, String value) {
        super("Host not found with " + field + ": " + value);
    }
}
