package com.turistafacoltoso.repository;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.turistafacoltoso.model.Abitazione;
import com.turistafacoltoso.repository.dao.AbitazioneDAO;
import com.turistafacoltoso.util.DataBaseConnection;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class AbitazioneDAOImpl implements AbitazioneDAO {

    private static final String INSERT_QUERY = "INSERT INTO abitazione (nome_abitazione, indirizzo_abitazione, n_locali, n_posti_letto, prezzo_per_notte, disponibilita_inizio, disponibilita_fine, id_host) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id";
    private static final String SELECT_ALL = "SELECT * FROM abitazione";
    private static final String SELECT_BY_ID = "SELECT * FROM abitazione WHERE id = ?";
    private static final String SELECT_BY_N_LOCALI = "SELECT * FROM abitazione WHERE n_locali = ?";
    private static final String SELECT_BY_NOME = "SELECT * FROM abitazione WHERE nome_abitazione = ?";
    private static final String SELECT_BY_DISPONIBILITA = "SELECT * FROM abitazione WHERE disponibilita_inizio <= ? AND disponibilita_fine >= ?";
    private static final String UPDATE_QUERY = "UPDATE abitazione SET nome_abitazione = ?, indirizzo_abitazione = ?, n_locali = ?, n_posti_letto = ?, prezzo_per_notte = ?, disponibilita_inizio = ?, disponibilita_fine = ?, id_host = ? WHERE id = ?";
    private static final String DELETE_ALL = "DELETE FROM abitazione";
    private static final String DELETE_BY_ID = "DELETE FROM abitazione WHERE id = ?";
    private static final String DELETE_BY_NAME = "DELETE FROM abitazione WHERE nome_abitazione = ?";

    @Override
    public Abitazione create(Abitazione a) {
        log.info("Tentativo di creazione abitazione: {}", a.getNomeAbitazione());
        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(INSERT_QUERY)) {

            mapAbitazioneToStatement(ps, a);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    a.setId(rs.getInt(1));
                    log.info("Abitazione creata con successo con ID: {}", a.getId());
                }
            }
            return a;
        } catch (SQLException e) {
            log.error("Errore durante la creazione dell'abitazione: ", e);
            throw new RuntimeException("Errore Database (create)", e);
        }
    }

    @Override
    public List<Abitazione> findAll() {
        log.info("Recupero lista completa abitazioni");
        List<Abitazione> lista = new ArrayList<>();
        try (Connection conn = DataBaseConnection.getConnection();
                Statement st = conn.createStatement();
                ResultSet rs = st.executeQuery(SELECT_ALL)) {

            while (rs.next()) {
                lista.add(mapResultSetToAbitazione(rs));
            }
            log.info("Trovate {} abitazioni", lista.size());
        } catch (SQLException e) {
            log.error("Errore findAll: ", e);
            throw new RuntimeException(e);
        }
        return lista;
    }

    @Override
    public Optional<Abitazione> findById(Integer id) {
        return findSingleByParam(SELECT_BY_ID, id);
    }

    @Override
    public List<Abitazione> findByNLocali(Integer number) {
        log.info("Ricerca abitazioni con {} locali", number);
        List<Abitazione> result = new ArrayList<>();
        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(SELECT_BY_N_LOCALI)) {
            ps.setInt(1, number);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    result.add(mapResultSetToAbitazione(rs));
                }
            }
        } catch (SQLException e) {
            log.error("Errore findByNLocali: ", e);
        }
        return result; // Restituisce lista vuota se non trova nulla, non null!
    }

    @Override
    public List<Abitazione> findByNomeAbitazione(String name) {
        log.info("ricerca abitazioni per nome {}",name);
        List<Abitazione> lA = new ArrayList<>();

        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(SELECT_BY_NOME)) {
            ps.setString(1, name);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    lA.add(mapResultSetToAbitazione(rs));
                }
            }
        } catch (SQLException e) {
            log.error("Errore findByNomeAbitazione: ", e);
        }
        return lA;
    }

    @Override
    public List<Abitazione> findByDataDisponibilita(LocalDate dataInizio, LocalDate dataFine) {
        log.info("Ricerca abitazioni disponibili tra {} e {}", dataInizio, dataFine);
        List<Abitazione> result = new ArrayList<>();
        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(SELECT_BY_DISPONIBILITA)) {

            ps.setDate(1, Date.valueOf(dataInizio));
            ps.setDate(2, Date.valueOf(dataFine));

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    result.add(mapResultSetToAbitazione(rs));
                }
            }
        } catch (SQLException e) {
            log.error("Errore findByDataDisponibilita: ", e);
        }
        return result;
    }

    @Override
    public Optional<Abitazione> update(Abitazione a) {
        log.info("Aggiornamento abitazione ID: {}", a.getId());
        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(UPDATE_QUERY)) {

            mapAbitazioneToStatement(ps, a);
            ps.setInt(9, a.getId()); // ID per la clausola WHERE

            int rows = ps.executeUpdate();
            if (rows > 0) {
                log.info("Update completato per ID: {}", a.getId());
                return Optional.of(a);
            }
        } catch (SQLException e) {
            log.error("Errore update abitazione {}: ", a.getId(), e);
        }
        return Optional.empty();
    }

    @Override
    public int deleteAll() {
        log.warn("Richiesta cancellazione di TUTTE le abitazioni");
        try (Connection conn = DataBaseConnection.getConnection();
                Statement st = conn.createStatement()) {
            int deleted = st.executeUpdate(DELETE_ALL);
            log.info("Cancellate {} abitazioni", deleted);
            return deleted;
        } catch (SQLException e) {
            log.error("Errore deleteAll: ", e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean deleteById(Integer id) {
        log.info("Cancellazione abitazione ID: {}", id);
        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(DELETE_BY_ID)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            log.error("Errore deleteById {}: ", id, e);
            return false;
        }
    }

    @Override
    public boolean deleteByName(String name) {
        log.info("Cancellazione abitazioni con nome: {}", name);
        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(DELETE_BY_NAME)) {
            ps.setString(1, name);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            log.error("Errore deleteByName {}: ", name, e);
            return false;
        }
    }

    // --- Metodi Helper ---

    private void mapAbitazioneToStatement(PreparedStatement ps, Abitazione a) throws SQLException {
        ps.setString(1, a.getNomeAbitazione());
        ps.setString(2, a.getIndirizzoAbitazione());
        ps.setInt(3, a.getNLocali());
        ps.setInt(4, a.getNPostiLetto());
        ps.setBigDecimal(5, a.getPrezzoPerNotte());
        ps.setDate(6, Date.valueOf(a.getDisponibilitaInizio()));
        ps.setDate(7, Date.valueOf(a.getDisponibilitaFine()));
        ps.setInt(8, a.getIdHost());
    }

    private Abitazione mapResultSetToAbitazione(ResultSet rs) throws SQLException {
        Abitazione a = new Abitazione();
        a.setId(rs.getInt("id"));
        a.setNomeAbitazione(rs.getString("nome_abitazione"));
        a.setIndirizzoAbitazione(rs.getString("indirizzo_abitazione"));
        a.setNLocali(rs.getInt("n_locali"));
        a.setNPostiLetto(rs.getInt("n_posti_letto"));
        a.setPrezzoPerNotte(rs.getBigDecimal("prezzo_per_notte"));
        a.setDisponibilitaInizio(rs.getDate("disponibilita_inizio").toLocalDate());
        a.setDisponibilitaFine(rs.getDate("disponibilita_fine").toLocalDate());
        a.setIdHost(rs.getInt("id_host"));
        return a;
    }

    private Optional<Abitazione> findSingleByParam(String query, Object param) {
        try (Connection conn = DataBaseConnection.getConnection();
                PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setObject(1, param);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToAbitazione(rs));
                }
            }
        } catch (SQLException e) {
            log.error("Errore durante la ricerca con query {}: ", query, e);
        }
        return Optional.empty();
    }

}
