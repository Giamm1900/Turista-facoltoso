package com.turistafacoltoso.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Prenotazione {
    private int id;
    private LocalDate dataInizio;
    private LocalDate dataFine;
    private int utenteId;
    private int abitazioneId;
    private LocalDateTime createdAt;
    public Prenotazione(LocalDate dataInizio, LocalDate dataFine, int utenteId, int abitazioneId,
            LocalDateTime createdAt) {
        this.dataInizio = dataInizio;
        this.dataFine = dataFine;
        this.utenteId = utenteId;
        this.abitazioneId = abitazioneId;
        this.createdAt = createdAt;
    }
}
