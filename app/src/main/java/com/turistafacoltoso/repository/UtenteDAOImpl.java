package com.turistafacoltoso.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import com.turistafacoltoso.model.Utente;
import com.turistafacoltoso.repository.dao.UtenteDAO;
import com.turistafacoltoso.util.DBHelper;
import com.turistafacoltoso.util.DataBaseConnection;
import com.turistafacoltoso.util.DataConverter;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class UtenteDAOImpl implements UtenteDAO {

    private static final String CREATE_QUERY = "INSERT INTO utente(nome_user,cognome,email,indirizzo_user) VALUES (?,?,?,?) RETURNING id, data_registrazione";
    private static final String FIND_QUERY = "SELECT * FROM utente";
    private static final String FIND_QUERY_BY_ID = "SELECT * FROM utente WHERE id = ? LIMIT 1 ";
    private static final String FIND_QUERY_BY_NAME = "SELECT * FROM utente WHERE nome_user = ? ";
    private static final String FIND_QUERY_BY_EMAIL = "SELECT * FROM utente WHERE email = ? LIMIT 1 ";
    private static final String UPDATE_QUERY = "UPDATE public.utente SET nome_user = ?, cognome = ?, indirizzo_user = ? WHERE id = ? ";
    private static final String DELETE_ALL_QUERY = "DELETE FROM utente";
    private static final String DELETE_QUERY_BY_ID = "DELETE FROM utente WHERE id = ?";
    private static final String DELETE_QUERY_BY_NAME = "DELETE FROM utente WHERE nome_user = ?";

    // CREATE
    @Override
    public Utente create(Utente u) {
        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(CREATE_QUERY)) {
            ps.setString(1, u.getNomeUser());
            ps.setString(2, u.getCognome());
            ps.setString(3, u.getEmail());
            ps.setString(4, u.getIndirizzoUser());

            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                u.setId(rs.getInt("id"));
                u.setDataRegistrazione(
                        DataConverter.convertLocalDateTimeFromTimestamp(rs.getTimestamp("data_registrazione")));
            }
        } catch (SQLException ex) {
            log.error("Errore creazione utente: {}", ex);
            throw new RuntimeException("SQLException", ex);
        }
        log.info("utente : {} creato con successo", u.toString());
        return u;
    }

    // READ
    @Override
    public List<Utente> findAll() {

        List<Utente> listUtenti = new ArrayList<>();
        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(FIND_QUERY)) {
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Utente u = new Utente();
                u.setId(rs.getInt("id"));
                u.setNomeUser(rs.getString("nome_user"));
                u.setCognome(rs.getString("cognome"));
                u.setEmail(rs.getString("email"));
                u.setIndirizzoUser(rs.getString("indirizzo_user"));
                u.setDataRegistrazione(
                        DataConverter.convertLocalDateTimeFromTimestamp(rs.getTimestamp("data_registrazione")));
                listUtenti.add(u);
            }
        } catch (SQLException ex) {
            log.error("errore utenti non trovati: {}" + ex);
            throw new RuntimeException("SQLException:" + ex);
        }
        log.info("lista utenti trovata:" + listUtenti.size());
        System.out.print(listUtenti);
        return listUtenti;
    }

    @Override
    public Map<String, Integer> findTopUsersByDaysLastMonth() {
        String sql = "SELECT u.id, u.nome_user, u.cognome, " +
                "SUM(p.data_fine - p.data_inizio) AS totale_giorni " +
                "FROM public.utente u " +
                "JOIN public.prenotazione p ON u.id = p.utente_id " +
                "WHERE p.data_inizio >= CURRENT_DATE - INTERVAL '1 month' " +
                "GROUP BY u.id, u.nome_user, u.cognome " +
                "ORDER BY totale_giorni DESC " +
                "LIMIT 5";

        Map<String, Integer> topTravelers = new LinkedHashMap<>();

        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql);
                ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                String utente = rs.getString("nome_user") + " " + rs.getString("cognome");
                int giorni = rs.getInt("totale_giorni");

                topTravelers.put(utente, giorni);
                log.info("Top Traveler trovato: {} con {} giorni prenotati", utente, giorni);
            }

        } catch (SQLException e) {
            log.error("Errore nel recupero dei Top Travelers: ", e);
            throw new RuntimeException("Errore SQL (getTopTravelersLastMonth)", e);
        }

        return topTravelers;
    }

    public Optional<Utente> findById(Integer id) {
        Utente u = new Utente();
        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(FIND_QUERY_BY_ID)) {
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                u.setId(rs.getInt("id"));
                u.setNomeUser(rs.getString("nome_user"));
                u.setCognome(rs.getString("cognome"));
                u.setEmail(rs.getString("email"));
                u.setIndirizzoUser(rs.getString("indirizzo_user"));
                u.setDataRegistrazione(
                        DataConverter.convertLocalDateTimeFromTimestamp(rs.getTimestamp("data_registrazione")));
                return Optional.of(u);
            }
        } catch (SQLException ex) {
            log.error("Errore durante il findById di Utente: {} " + ex);
            throw new RuntimeException("SQLException: " + ex);
        }
        log.info("Utente trovato: {}" + u.toString());
        return Optional.empty();
    }

    public Optional<Utente> findByEmail(String email) {
        Utente u = new Utente();
        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(FIND_QUERY_BY_EMAIL)) {
            ps.setString(1, email);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                u.setId(rs.getInt("id"));
                u.setNomeUser(rs.getString("nome_user"));
                u.setCognome(rs.getString("cognome"));
                u.setEmail(rs.getString("email"));
                u.setIndirizzoUser(rs.getString("indirizzo_user"));
                u.setDataRegistrazione(
                        DataConverter.convertLocalDateTimeFromTimestamp(rs.getTimestamp("data_registrazione")));
                return Optional.of(u);
            }
        } catch (SQLException ex) {
            log.error("Errore durante il findByEmail di Utente: {} " + ex);
            throw new RuntimeException("SQLException: " + ex);
        }
        log.info("Utente trovato: {} " + u.getClass().toString());
        return Optional.empty();
    }

    public Optional<Utente> findByUsername(String name) {
        Utente u = new Utente();
        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(FIND_QUERY_BY_NAME)) {
            ps.setString(1, name);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                u.setId(rs.getInt("id"));
                u.setNomeUser(rs.getString("nome_user"));
                u.setCognome(rs.getString("cognome"));
                u.setEmail(rs.getString("email"));
                u.setIndirizzoUser(rs.getString("indirizzo_user"));
                u.setDataRegistrazione(
                        DataConverter.convertLocalDateTimeFromTimestamp(rs.getTimestamp("data_registrazione")));
                return Optional.of(u);
            }
        } catch (SQLException ex) {
            log.error("Errore durante il findById: {} ", ex);
            throw new RuntimeException("SQLException: " + ex);
        }
        log.info("Utente trovato: {} " + u.getClass().toString());
        return Optional.empty();
    }

    // UPDATE

    public Utente update(Utente u) {
        DBHelper.executeUpdate(UPDATE_QUERY, ps -> {
            ps.setString(1, u.getNomeUser());
            ps.setString(2, u.getCognome());
            ps.setString(3, u.getEmail());
            ps.setString(4, u.getIndirizzoUser());
            ps.setInt(4, u.getId());
        });
        log.info("utente update {} : ", u.toString());
        return u;
    }

    // DELETE

    public int deleteAll() {
        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(DELETE_ALL_QUERY)) {

            int deleted = ps.executeUpdate();
            log.info("Eliminati utenti: {} ", deleted);
            return deleted;

        } catch (SQLException ex) {
            log.error("Errore durante l'eliminazione di tutti gli utenti", ex);
            throw new RuntimeException("SQLException: ", ex);
        }
    }

    public boolean deleteById(Integer id) {
        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(DELETE_QUERY_BY_ID)) {

            ps.setInt(1, id);
            int rowsAffected = ps.executeUpdate();

            if (rowsAffected > 0) {
                log.info("Utente eliminato con ID: {}", id);
                return true;
            }
            log.debug("Nessun utente eliminato con ID: {}", id);
            return false;

        } catch (SQLException ex) {
            log.error("Errore durante l'eliminazione per ID: {}", id, ex);
            throw new RuntimeException("SQLException: ", ex);
        }
    }

    public boolean deleteByUsername(String nomeUser) {
        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(DELETE_QUERY_BY_NAME)) {

            ps.setString(1, nomeUser);
            int rowsAffected = ps.executeUpdate();

            if (rowsAffected > 0) {
                log.info("Utente eliminato con ID: {}", nomeUser);
                return true;
            }
            log.debug("Nessun utente eliminato con ID: {}", nomeUser);
            return false;

        } catch (SQLException ex) {
            log.error("Errore durante l'eliminazione per ID: {}", nomeUser, ex);
            throw new RuntimeException("SQLException: ", ex);
        }
    }
}
