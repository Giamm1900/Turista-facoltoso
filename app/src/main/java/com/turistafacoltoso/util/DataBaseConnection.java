package com.turistafacoltoso.util;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class DataBaseConnection {
    private static String url;
    private static String user;
    private static String pwd;
    private static boolean initialized = false;

    public DataBaseConnection() {

    }

    public static void init(String properties) { 
        Properties props = new Properties();

        try (InputStream is = DataBaseConnection.class.getClassLoader().getResourceAsStream("config.properties")) {

            if (is == null) {
                throw new RuntimeException("Impossibile trovare config.properties nelle risorse!");
            }

            props.load(is);

            url = props.getProperty("db.url");
            user = props.getProperty("db.user");
            pwd = props.getProperty("db.pwd");

            Class.forName("org.postgresql.Driver");
            initialized = true;

        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
            throw new RuntimeException("Errore durante l'inizializzazione del DB", e);
        }
    }

    public static Connection getConnection() throws SQLException {

        if (!initialized) {
            throw new RuntimeException("Execute init() first!");
        }

        return DriverManager.getConnection(url, user, pwd);

    }
}
