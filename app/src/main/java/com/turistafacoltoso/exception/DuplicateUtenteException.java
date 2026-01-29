package com.turistafacoltoso.exception;

public class DuplicateUtenteException extends RuntimeException{ 
    public DuplicateUtenteException(String message){
        super(message);
    }

    public DuplicateUtenteException(String field,String value){
        super("user already exists whit: "+field + value);
    }
} 