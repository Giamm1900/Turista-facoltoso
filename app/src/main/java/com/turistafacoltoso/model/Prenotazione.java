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
}
