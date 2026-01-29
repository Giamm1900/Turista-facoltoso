package com.turistafacoltoso.exception;

public class DuplicatePrenotazioneException extends RuntimeException{
    public DuplicatePrenotazioneException(String message){
        super(message);
    }

    public DuplicatePrenotazioneException(String field,String value){
        super("Reservation already exists whit: "+field + value);
    }
}
