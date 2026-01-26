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
    private LocalDateTime dataDiRegistrazione;

    public Host(String nomeUser, String cognome, String email, String indirizzoUser, 
                LocalDateTime dataDiRegistrazione) {
        super(nomeUser, cognome, email, indirizzoUser);
        this.dataDiRegistrazione = dataDiRegistrazione;
    }
}
