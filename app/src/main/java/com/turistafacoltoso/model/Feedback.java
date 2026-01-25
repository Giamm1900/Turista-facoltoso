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
    private int punteggio;
    private int prenotazioneId;
    private int idHost;
    public Feedback(String titolo, String testo, int punteggio, int prenotazioneId, int idHost) {
        this.titolo = titolo;
        this.testo = testo;
        this.punteggio = punteggio;
        this.prenotazioneId = prenotazioneId;
        this.idHost = idHost;
    }
}
