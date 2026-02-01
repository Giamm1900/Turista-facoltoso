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

import com.turistafacoltoso.model.Host;
import com.turistafacoltoso.repository.dao.HostDAO;
import com.turistafacoltoso.util.DataBaseConnection;
import com.turistafacoltoso.util.DataConverter;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class HostDAOImpl implements HostDAO {

    @Override
    public Host create(Host h) {
        String sql = "INSERT INTO host(id_utente) VALUES(?) RETURNING id, data_registrazione_host";

        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, h.getIdUtente());

            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                h.setId(rs.getInt("id"));
                h.setDataRegistrazione(
                        DataConverter.convertLocalDateTimeFromTimestamp(rs.getTimestamp("data_registrazione_host")));
            }
        } catch (SQLException ex) {
            log.error("Errore creazione host: {}", ex);
            throw new RuntimeException("SQLException", ex);
        }
        log.info("host : {} creato con successo", h.toString());
        return h;
    }

    @Override
    public Map<String, Integer> findTopHostsLastMonth() {
        String sql = "SELECT u.nome_user, u.cognome, COUNT(p.id) as totale_prenotazioni " +
                "FROM public.host h " +
                "JOIN public.utente u ON h.id = u.id " + // Assicurati che il join sia corretto h.id = u.id
                "JOIN public.abitazione a ON h.id = a.id_host " +
                "JOIN public.prenotazione p ON a.id = p.abitazione_id " +
                "WHERE p.data_inizio >= CURRENT_DATE - INTERVAL '1 month' " +
                "GROUP BY u.nome_user, u.cognome " +
                "ORDER BY totale_prenotazioni DESC";

        Map<String, Integer> ranking = new LinkedHashMap<>(); // LinkedHashMap mantiene l'ordine del database (DESC)

        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql);
                ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                String nomeCompleto = rs.getString("nome_user") + " " + rs.getString("cognome");
                int prenotazioni = rs.getInt("totale_prenotazioni");

                ranking.put(nomeCompleto, prenotazioni);
                log.info("Host in classifica: {} - Prenotazioni: {}", nomeCompleto, prenotazioni);
            }

        } catch (SQLException ex) {
            log.error("Errore nel calcolo classifica Top Hosts: ", ex);
            throw new RuntimeException("Errore SQL (findTopHostsLastMonth)", ex);
        }

        return ranking;
    }

    @Override
    public Map<String, Integer> findAllSuperHosts() {
        String sql = "SELECT u.nome_user, u.cognome, sh.totale_prenotazioni " +
                "FROM super_host sh " +
                "JOIN public.utente u ON sh.host_id = u.id " +
                "ORDER BY sh.totale_prenotazioni DESC";

        Map<String, Integer> superHostStats = new LinkedHashMap<>();

        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql);
                ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                String nomeUser = rs.getString("nome_user") + " " + rs.getString("cognome");
                int totale = rs.getInt("totale_prenotazioni");

                superHostStats.put(nomeUser, totale);
                log.info("SuperHost caricato: {} con {} prenotazioni", nomeUser, totale);
            }

        } catch (SQLException e) {
            log.error("Errore durante il recupero dei SuperHost: ", e);
            throw new RuntimeException("Errore SQL vista super_host", e);
        }

        return superHostStats;
    }

    @Override
    public List<Host> findAll() {
        List<Host> listaHost = new ArrayList<>();
        String sql = "SELECT h.id AS host_id,h.id_utente,h.data_registrazione_host,u.nome_user,u.cognome,u.email,u.indirizzo_user FROM host h JOIN utente u ON h.id_utente = u.id";

        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {

            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Host h = new Host();
                h.setId(rs.getInt("host_id"));
                h.setIdUtente(rs.getInt("id_utente"));
                h.setDataRegistrazione(
                        DataConverter.convertLocalDateTimeFromTimestamp(rs.getTimestamp("data_registrazione_host")));
                h.setNomeUser(rs.getString("nome_user"));
                h.setCognome(rs.getString("cognome"));
                h.setEmail(rs.getString("email"));
                h.setIndirizzoUser(rs.getString("indirizzo_user"));

                listaHost.add(h);
            }

        } catch (SQLException ex) {
            log.error("Errore nel recupero degli host", ex);
            throw new RuntimeException("SQLException", ex);
        }

        log.info("Lista host trovata: {}", listaHost.size());
        return listaHost;
    }

    @Override
    public Optional<Host> findById(Integer id) {
        String sql = "SELECT h.id AS host_id,h.id_utente,h.data_registrazione_host,u.nome_user,u.cognome,u.email,u.indirizzo_user FROM host h JOIN utente u ON h.id_utente = u.id WHERE h.id = ? LIMIT 1 ";
        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Host h = new Host();
                h.setId(rs.getInt("host_id"));
                h.setId(rs.getInt("id_utente"));
                h.setDataRegistrazione(
                        DataConverter.convertLocalDateTimeFromTimestamp(rs.getTimestamp("data_registrazione_host")));
                h.setNomeUser(rs.getString("nome_user"));
                h.setCognome(rs.getString("cognome"));
                h.setEmail(rs.getString("email"));
                h.setIndirizzoUser(rs.getString("indirizzo_user"));
                log.info("Utente trovato: {}", h.toString());
                return Optional.of(h);
            }
        } catch (SQLException ex) {
            log.error("Errore durante il findById di Utente: {} ", ex);
            throw new RuntimeException("SQLException: ", ex);
        }
        return Optional.empty();
    }

    @Override
    public Optional<Host> update(Host h) {
        String sql = "UPDATE host SET id_utente = ? WHERE id = ?";

        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, h.getIdUtente());
            ps.setInt(2, h.getId());

            int updated = ps.executeUpdate();
            if (updated == 0) {
                return Optional.empty(); // host non trovato
            }

            return Optional.of(h);

        } catch (SQLException ex) {
            log.error("Errore durante update Host", ex);
            throw new RuntimeException("SQLException", ex);
        }
    }

    @Override
    public int deleteAll() {
        String sql = "DELETE FROM host";

        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {

            int deleted = ps.executeUpdate();
            log.info("Eliminati host: {} ", deleted);
            return deleted;

        } catch (SQLException ex) {
            log.error("Errore durante l'eliminazione di tutti gli host", ex);
            throw new RuntimeException("SQLException: ", ex);
        }
    }

    @Override
    public boolean deleteById(Integer id) {
        String sql = "DELETE FROM utente WHERE id = ?";

        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            int deleted = ps.executeUpdate();

            if (deleted > 0) {
                log.info("Host eliminato con ID: {}", id);
                return true;
            }
            log.debug("Nessun host eliminato con ID: {}", id);
            return false;

        } catch (SQLException ex) {
            log.error("Errore durante l'eliminazione dell'host", ex);
            throw new RuntimeException("SQLException: ", ex);
        }
    }

}
