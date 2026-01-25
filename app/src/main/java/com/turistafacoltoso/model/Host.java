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
    private int id;
    private LocalDateTime dataDiRegistrazione;

    public Host(int id, String nomeUser, String cognome, String email, String indirizzoUser, 
                LocalDateTime dataDiRegistrazione) {
        super(id, nomeUser, cognome, email, indirizzoUser);
        this.dataDiRegistrazione = dataDiRegistrazione;
    }
}
