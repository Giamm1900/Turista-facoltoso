package com.turistafacoltoso.controller;

import com.turistafacoltoso.service.UtenteDAOService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class UtenteController {

    private final UtenteDAOService utenteDAOService;

    public UtenteController(){
        utenteDAOService = new UtenteDAOService();
    }

}
