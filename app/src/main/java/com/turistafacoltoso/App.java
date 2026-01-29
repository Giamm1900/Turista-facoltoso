package com.turistafacoltoso;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.turistafacoltoso.controller.AbitazioneController;
import com.turistafacoltoso.controller.HostController;
import com.turistafacoltoso.controller.UtenteController;
import com.turistafacoltoso.util.DataBaseConnection;

import io.javalin.Javalin;
import io.javalin.json.JavalinJackson;

public class App 
{
    public static void main( String[] args )
    {   
        DataBaseConnection.init("config.properties");

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS); // Per gestire conversioni json data/timestamp 

        Javalin app = Javalin.create(config -> {
            config.jsonMapper(new JavalinJackson(objectMapper, true));
            config.http.defaultContentType = "application/json";
            config.bundledPlugins.enableCors(cors -> {
                cors.addRule(it->{
                    it.anyHost();
                });
            });
        }).start(7001);
        app.before(ctx -> {
            ctx.header("Access-Control-Allow-Origin", "*");
            ctx.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
            ctx.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
        });

        UtenteController utenteController = new UtenteController();
        utenteController.registerRoutes(app);

        HostController hostController = new HostController();
        hostController.registerRoutes(app);

        AbitazioneController abitazioneController = new AbitazioneController();
        abitazioneController.registerRoutes(app);
    }
}
