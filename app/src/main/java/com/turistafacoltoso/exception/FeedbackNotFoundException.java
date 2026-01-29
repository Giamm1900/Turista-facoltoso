package com.turistafacoltoso.exception;

public class FeedbackNotFoundException extends RuntimeException{
    public FeedbackNotFoundException(String message) {
        super(message);
    }

    public FeedbackNotFoundException(Integer id) {
        super("Feedback non trovato con id: " + id);
    }

    public FeedbackNotFoundException(String field, String value) {
        super("Feedback not found with " + field + ": " + value);
    }
}
