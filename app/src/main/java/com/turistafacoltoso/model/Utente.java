package com.turistafacoltoso.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Utente {
    protected int id;
    protected String nomeUser;
    protected String cognome;
    protected String email;
    protected String indirizzoUser;

    public Utente(String nomeUser,String cognome,String email, String indirizzoUser){
        this.nomeUser = nomeUser;
        this.cognome = cognome;
        this.email = email;
        this.indirizzoUser = indirizzoUser;
    }
}
