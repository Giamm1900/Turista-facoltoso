package com.turistafacoltoso.exception;

public class DuplicateAbitazioneException extends RuntimeException{
    public DuplicateAbitazioneException(String message){
        super(message);
    }

    public DuplicateAbitazioneException(String field,String value){
        super("Accomodation already exists whit: "+field + value);
    }
}
