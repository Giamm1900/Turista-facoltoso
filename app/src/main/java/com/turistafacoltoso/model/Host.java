package com.turistafacoltoso.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Host extends Utente{
    private int idUtente;
    private LocalDateTime dataDiRegistrazioneHost;

    public Host(int idHost,int idUtente, String nomeUser, String cognome, String email, String indirizzoUser, 
                LocalDateTime dataDiRegistrazioneHost) {
        super(nomeUser, cognome, email, indirizzoUser);
        this.id = idHost;
        this.idUtente = idUtente;
        this.dataDiRegistrazioneHost = dataDiRegistrazioneHost;
    }

    public Host(int idHost, int idUtente, String nomeUser, String cognome, String email, 
                String indirizzoUser, LocalDateTime dataRegUtente, LocalDateTime dataRegHost) {
        // Richiama il costruttore generato da @AllArgsConstructor di Utente (6 parametri)
        super(idUtente, nomeUser, cognome, email, indirizzoUser, dataRegUtente);
        this.id = idHost;
        this.idUtente = idUtente;
        this.dataDiRegistrazioneHost = dataRegHost;
    }
}
