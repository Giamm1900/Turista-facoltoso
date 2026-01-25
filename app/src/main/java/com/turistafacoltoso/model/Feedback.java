package com.turistafacoltoso.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Feedback {
    private int id;
    private String titolo;
    private String testo;
    private int punteggio; // Vincolo 1-5 gestito a livello logico/DB
    private int prenotazioneId;
    private int idHost;
}
