package com.turistafacoltoso.repository;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.turistafacoltoso.model.Prenotazione;
import com.turistafacoltoso.repository.dao.PrenotazioneDAO;
import com.turistafacoltoso.util.DataBaseConnection;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class PrenotazioneDAOImpl implements PrenotazioneDAO {
    private static final String INSERT_QUERY = "INSERT INTO prenotazione (utente_id, data_inizio, data_fine, abitazione_id, created_at) VALUES (?, ?, ?, ?, ?) RETURNING id";
    private static final String SELECT_ALL = "SELECT * FROM prenotazione";
    private static final String SELECT_BY_ID = "SELECT * FROM prenotazione WHERE id = ?";
    private static final String SELECT_BY_DATA_CREAZIONE = "SELECT * FROM prenotazione WHERE created_at = ?";
    private static final String SELECT_BY_UTENTE = "SELECT * FROM prenotazione WHERE utente_id = ?";
    private static final String UPDATE_QUERY = "UPDATE prenotazione SET utente_id = ?, data_inizio = ?, data_fine = ?, abitazione_id = ? WHERE id = ?";
    private static final String DELETE_BY_ID = "DELETE FROM prenotazione WHERE id = ?";
    private static final String DELETE_ALL = "DELETE FROM prenotazione";

    @Override
    public Prenotazione create(Prenotazione p) {
        // 1. Validazione logica: data inizio deve essere prima della fine
        // Usiamo isBefore() di LocalDate, molto più pulito di Date.valueOf
        if (p.getDataInizio().isAfter(p.getDataFine()) || p.getDataInizio().isEqual(p.getDataFine())) {
            throw new IllegalArgumentException("La data di inizio deve essere precedente alla data di fine.");
        }

        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(INSERT_QUERY)) {

            ps.setInt(1, p.getUtenteId());
            ps.setDate(2, Date.valueOf(p.getDataInizio()));
            ps.setDate(3, Date.valueOf(p.getDataFine()));
            ps.setInt(4, p.getAbitazioneId());

            // Gestione data creazione
            LocalDateTime createdAt = (p.getCreatedAt() != null) ? p.getCreatedAt() : LocalDateTime.now();
            ps.setTimestamp(5, Timestamp.valueOf(createdAt));

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    p.setId(rs.getInt(1));
                    p.setCreatedAt(createdAt); // Aggiorniamo l'oggetto con la data effettiva
                }
            }

            log.info("Prenotazione creata con successo: ID {}", p.getId());
            return p;

        } catch (SQLException e) {
            log.error("Errore SQL durante la creazione della prenotazione: ", e);
            throw new RuntimeException("Impossibile salvare la prenotazione nel database", e);
        }
    }

    @Override
    public List<Prenotazione> findAll() {
        List<Prenotazione> list = new ArrayList<>();
        try (Connection conn = DataBaseConnection.getConnection();
                Statement st = conn.createStatement();
                ResultSet rs = st.executeQuery(SELECT_ALL)) {
            while (rs.next()) {
                list.add(mapResultSetToPrenotazione(rs));
            }
        } catch (SQLException e) {
            log.error("Errore nel recupero prenotazioni {}: ", e);
            throw new RuntimeException("Errore nel recupero delle prenotazioni", e);
        }
        return list;
    }

    @Override
    public Optional<Prenotazione> findById(Integer id) {
        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(SELECT_BY_ID)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToPrenotazione(rs));
                }
            }
        } catch (SQLException e) {
            log.error("Errore nel recupero prenotazioni per id {}: ", e);
            throw new RuntimeException("Errore nel findById", e);
        }
        return Optional.empty();
    }

    @Override
    public Optional<Prenotazione> findByDataCreazione(LocalDateTime localDateTime) {
        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(SELECT_BY_DATA_CREAZIONE)) {
            ps.setTimestamp(1, Timestamp.valueOf(localDateTime));
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToPrenotazione(rs));
                }
            }
        } catch (SQLException e) {
            log.error("Errore nel recupero prenotazioni per data creazione {}: ", e);
            throw new RuntimeException("Errore nella ricerca per data creazione", e);
        }
        return Optional.empty();
    }

    @Override
    public List<Prenotazione> findByUtenteId(Integer idUtente) {
        List<Prenotazione> lp = new ArrayList<>();
        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(SELECT_BY_UTENTE)) {

            ps.setInt(1, idUtente);

            try (ResultSet rs = ps.executeQuery()) {
                // 1. Usa WHILE invece di IF per scorrere tutte le righe
                while (rs.next()) {
                    lp.add(mapResultSetToPrenotazione(rs));
                }
            }
        } catch (SQLException e) {
            log.error("Errore nel recupero prenotazioni per utente {}: ", idUtente, e);
            throw new RuntimeException("Errore nella ricerca per ID utente", e);
        }

        // 2. Restituisci la lista (vuota o piena), mai null
        return lp;
    }

    @Override
    public Optional<Prenotazione> update(Prenotazione p) {
        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(UPDATE_QUERY)) {
            ps.setInt(1, p.getUtenteId());
            ps.setDate(2, Date.valueOf(p.getDataInizio()));
            ps.setDate(3, Date.valueOf(p.getDataFine()));
            ps.setInt(4, p.getAbitazioneId());
            ps.setInt(5, p.getId());

            int affectedRows = ps.executeUpdate();
            return affectedRows > 0 ? Optional.of(p) : Optional.empty();
        } catch (SQLException e) {
            log.error("Errore update prenotazioni {}: ", e);
            throw new RuntimeException("Errore durante l'update", e);
        }
    }

    @Override
    public int deleteAll() {
        try (Connection conn = DataBaseConnection.getConnection();
                Statement st = conn.createStatement()) {
            return st.executeUpdate(DELETE_ALL);
        } catch (SQLException e) {
            log.error("Errore eliminazione prenotazioni {}: ", e);
            throw new RuntimeException("Errore nel cancellare tutto", e);
        }
    }

    @Override
    public boolean deleteById(Integer id) {
        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(DELETE_BY_ID)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            log.error("Errore eliminazione by id {}: ", e);
            throw new RuntimeException("Errore nella cancellazione", e);
        }
    }

    // Metodo helper per evitare ripetizioni
    private Prenotazione mapResultSetToPrenotazione(ResultSet rs) throws SQLException {
        Prenotazione p = new Prenotazione();
        p.setId(rs.getInt("id"));
        p.setUtenteId(rs.getInt("utente_id"));
        p.setDataInizio(rs.getDate("data_inizio").toLocalDate());
        p.setDataFine(rs.getDate("data_fine").toLocalDate());
        p.setAbitazioneId(rs.getInt("abitazione_id"));
        p.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        return p;
    }

}
