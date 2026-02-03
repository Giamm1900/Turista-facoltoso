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
    private int idUser;
    private int idAbitazione;
    public Feedback(String titolo, String testo, int punteggio, int prenotazioneId, int idUser,int idAbitazione) {
        this.titolo = titolo;
        this.testo = testo;
        this.punteggio = punteggio;
        this.prenotazioneId = prenotazioneId;
        this.idUser = idUser;
        this.idAbitazione = idAbitazione;
    }
}
