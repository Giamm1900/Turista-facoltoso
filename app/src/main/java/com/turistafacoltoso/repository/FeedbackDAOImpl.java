package com.turistafacoltoso.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.turistafacoltoso.model.Feedback;
import com.turistafacoltoso.repository.dao.FeedbackDAO;
import com.turistafacoltoso.util.DataBaseConnection;

import lombok.extern.slf4j.Slf4j;
@Slf4j
public class FeedbackDAOImpl implements FeedbackDAO {
    private static final String INSERT_QUERY = "INSERT INTO feedback (id_utente,id_abitazione, titolo, testo, punteggio, prenotazione_id) VALUES (?,?, ?, ?, ?, ?) RETURNING id";
    private static final String SELECT_ALL = "SELECT * FROM feedback";
    private static final String SELECT_BY_ID = "SELECT * FROM feedback WHERE id = ?";
    private static final String SELECT_BY_ABITAZIONE = "SELECT * FROM feedback WHERE id_abitazione = ?";
    private static final String SELECT_BY_PUNTEGGIO = "SELECT * FROM feedback WHERE punteggio = ?";
    private static final String UPDATE_QUERY = "UPDATE feedback SET id_utente = ?, id_abitazione = ?, titolo = ?, testo = ?, punteggio = ?, prenotazione_id = ? WHERE id = ?";
    private static final String DELETE_ALL = "DELETE FROM feedback";
    private static final String DELETE_BY_ID = "DELETE FROM feedback WHERE id = ?";

    @Override
    public Feedback create(Feedback f) {
        log.info("Inserimento nuovo feedback per la prenotazione: {}", f.getPrenotazioneId());
        try (Connection conn = DataBaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(INSERT_QUERY)) {
            
            ps.setInt(1, f.getIdUser());
            ps.setInt(2, f.getIdAbitazione());
            ps.setString(3, f.getTitolo());
            ps.setString(4, f.getTesto());
            ps.setInt(5, f.getPunteggio());
            ps.setInt(6, f.getPrenotazioneId());

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    f.setId(rs.getInt(1));
                    log.info("Feedback creato con successo, ID: {}", f.getId());
                }
            }
            return f;
        } catch (SQLException e) {
            log.error("Errore durante la creazione del feedback: ", e);
            throw new RuntimeException("Errore salvataggio feedback", e);
        }
    }

    @Override
    public List<Feedback> findAll() {
        List<Feedback> list = new ArrayList<>();
        try (Connection conn = DataBaseConnection.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(SELECT_ALL)) {
            while (rs.next()) {
                list.add(mapResultSetToFeedback(rs));
            }
        } catch (SQLException e) {
            log.error("Errore findAll feedback: ", e);
        }
        return list;
    }

    @Override
    public Optional<Feedback> findById(Integer id) {
        try (Connection conn = DataBaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(SELECT_BY_ID)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToFeedback(rs));
                }
            }
        } catch (SQLException e) {
            log.error("Errore findById feedback {}: ", id, e);
        }
        return Optional.empty();
    }

    @Override
    public List<Feedback> findByIdHost(Integer idAbitazione) {
        log.info("Recupero feedback per abitazione id: {}", idAbitazione);
        List<Feedback> list = new ArrayList<>();
        try (Connection conn = DataBaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(SELECT_BY_ABITAZIONE)) {
            ps.setInt(1, idAbitazione);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToFeedback(rs));
                }
            }
        } catch (SQLException e) {
            log.error("Errore findByIdHost: ", e);
        }
        return list;
    }

    @Override
    public List<Feedback> findByPunteggio(Integer number) {
        List<Feedback> list = new ArrayList<>();
        try (Connection conn = DataBaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(SELECT_BY_PUNTEGGIO)) {
            ps.setInt(1, number);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToFeedback(rs));
                }
            }
        } catch (SQLException e) {
            log.error("Errore findByPunteggio {}: ", number, e);
        }
        return list;
    }

    @Override
    public Optional<Feedback> update(Feedback f) {
        try (Connection conn = DataBaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(UPDATE_QUERY)) {
            ps.setInt(1, f.getIdUser());
            ps.setInt(2, f.getIdAbitazione());
            ps.setString(3, f.getTitolo());
            ps.setString(4, f.getTesto());
            ps.setInt(5, f.getPunteggio());
            ps.setInt(6, f.getPrenotazioneId());
            ps.setInt(7, f.getId());

            int affectedRows = ps.executeUpdate();
            return affectedRows > 0 ? Optional.of(f) : Optional.empty();
        } catch (SQLException e) {
            log.error("Errore update feedback {}: ", f.getId(), e);
            return Optional.empty();
        }
    }

    @Override
    public int deleteAll() {
        try (Connection conn = DataBaseConnection.getConnection();
             Statement st = conn.createStatement()) {
            return st.executeUpdate(DELETE_ALL);
        } catch (SQLException e) {
            log.error("Errore deleteAll feedback: ", e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean deleteById(Integer id) {
        try (Connection conn = DataBaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(DELETE_BY_ID)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            log.error("Errore deleteById feedback {}: ", id, e);
            return false;
        }
    }

    private Feedback mapResultSetToFeedback(ResultSet rs) throws SQLException {
        Feedback f = new Feedback();
        f.setId(rs.getInt("id"));
        f.setIdUser(rs.getInt("id_utente"));
        f.setIdAbitazione(rs.getInt("id_abitazione"));
        f.setTitolo(rs.getString("titolo"));
        f.setTesto(rs.getString("testo"));
        f.setPunteggio(rs.getInt("punteggio"));
        f.setPrenotazioneId(rs.getInt("prenotazione_id"));
        return f;
    }
    
}
