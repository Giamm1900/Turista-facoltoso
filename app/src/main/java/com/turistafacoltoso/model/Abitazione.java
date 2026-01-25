package com.turistafacoltoso.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Abitazione {
    private int id;
    private String nomeAbitazione;
    private String indirizzoAbitazione;
    private int nLocali;
    private int nPostiLetto;
    private BigDecimal prezzoPerNotte;
    private LocalDate disponibilitaInizio;
    private LocalDate disponibilitaFine;
    private int idHost;
}
