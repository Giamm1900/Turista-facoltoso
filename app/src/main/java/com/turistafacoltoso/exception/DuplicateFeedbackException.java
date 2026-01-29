package com.turistafacoltoso.exception;

public class DuplicateFeedbackException extends RuntimeException{
    public DuplicateFeedbackException(String message){
        super(message);
    }

    public DuplicateFeedbackException(String field,String value){
        super("Feedback already exists whit: "+field + value);
    }
}
