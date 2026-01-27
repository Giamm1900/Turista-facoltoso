package com.turistafacoltoso.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.eclipse.jetty.server.Authentication.User;

import com.turistafacoltoso.model.Utente;
import com.turistafacoltoso.repository.dao.UtenteDAO;
import com.turistafacoltoso.util.DBHelper;
import com.turistafacoltoso.util.DataBaseConnection;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class UtenteDAOImpl implements UtenteDAO {

    // CREATE
    @Override
    public Utente create(Utente u){
        String sql = "INSERT INTO utente(nome_user,cognome,email,indirizzo_user) VALUES (?,?,?,?,?) RETURNING id, data_registrazione";
        try (Connection conn = DataBaseConnection.getConnection();
        PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, u.getNomeUser());
            ps.setString(2, u.getCognome());
            ps.setString(3, u.getEmail());
            ps.setString(4, u.getIndirizzoUser());

            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                u.setNomeUser(rs.getString("nome_user"));
                u.setCognome(rs.getString("cognome"));
                u.setEmail(rs.getString("email"));
                u.setIndirizzoUser(rs.getString("indirizzo_user"));
            }
        } catch (SQLException ex) {
            log.error("Errore creazione utente: {}"+u.getClass().toString()+ex);
            throw new RuntimeException("SQLException"+ex);
        }
        log.info("utente : {} creato con successo"+u.getClass().toString());
        return u;
    }

    // READ
    @Override
    public List<Utente> findAll(){

        List<Utente> listUtenti = new ArrayList<>();
        String sql = "SELECT * FROM utente";
        try (Connection conn = DataBaseConnection.getConnection();
        PreparedStatement ps = conn.prepareStatement(sql)){
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Utente u = new Utente();
                u.setId(rs.getInt("id"));
                u.setNomeUser(rs.getString("nome_user"));
                u.setCognome(rs.getString("cognome"));
                u.setEmail(rs.getString("email"));
                u.setIndirizzoUser(rs.getString("indirizzo_user"));

                listUtenti.add(u);
            }
            
        } catch (SQLException ex) {
            log.error("errore utenti non trovati: {}"+ex);
            throw new RuntimeException("SQLException:"+ex);
        }

        log.info("lista utenti trovata:"+listUtenti.size());
        System.out.print(listUtenti);
        return listUtenti;
    }

    public Optional<Utente> findById(Integer id){
        String sql = "SELECT * FROM utente WHERE id = ? LIMIT 1; ";
        Utente u = new Utente();
        try (Connection conn = DataBaseConnection.getConnection();
        PreparedStatement ps = conn.prepareStatement(sql)){
            ResultSet rs = ps.executeQuery();
            ps.setInt(1, id);
            while (rs.next()) {
                u.setId(rs.getInt("id"));
                u.setNomeUser(rs.getString("nome_user"));
                u.setCognome(rs.getString("cognome"));
                u.setEmail(rs.getString("email"));
                u.setIndirizzoUser(rs.getString("indirizzo_user"));
                return Optional.of(u);
            }
        } catch (SQLException ex) {
            log.error("Errore durante il findById di Utente: {} "+ex);
            throw new RuntimeException("SQLException: "+ex);
        }
        log.info("Utente trovato: {}"+u.getClass().toString());
        return Optional.empty();
    }

    public Optional<Utente> findByEmail(String email){
        String sql = "SELECT * FROM utente WHERE email = ? LIMIT 1; ";
        Utente u = new Utente();
        try (Connection conn = DataBaseConnection.getConnection();
        PreparedStatement ps = conn.prepareStatement(sql)){
            ResultSet rs = ps.executeQuery();
            ps.setString(1, email);
            while (rs.next()) {
                u.setId(rs.getInt("id"));
                u.setNomeUser(rs.getString("nome_user"));
                u.setCognome(rs.getString("cognome"));
                u.setEmail(rs.getString("email"));
                u.setIndirizzoUser(rs.getString("indirizzo_user"));
                return Optional.of(u);
            }
        } catch (SQLException ex) {
            log.error("Errore durante il findByEmail di Utente: {} "+ex);
            throw new RuntimeException("SQLException: "+ex);
        }
        log.info("Utente trovato: {} "+u.getClass().toString());
        return Optional.empty();
    }

    public Optional<Utente> findByUsername(String name){
        String sql = "SELECT * FROM utente WHERE nome_user = ? LIMIT 1; ";
        Utente u = new Utente();
        try (Connection conn = DataBaseConnection.getConnection();
        PreparedStatement ps = conn.prepareStatement(sql)){
            ResultSet rs = ps.executeQuery();
            ps.setString(1, name);
            while (rs.next()) {
                u.setId(rs.getInt("id"));
                u.setNomeUser(rs.getString("nome_user"));
                u.setCognome(rs.getString("cognome"));
                u.setEmail(rs.getString("email"));
                u.setIndirizzoUser(rs.getString("indirizzo_user"));
                return Optional.of(u);
            }
        } catch (SQLException ex) {
            log.error("Errore durante il findById di Utente: {} "+ex);
            throw new RuntimeException("SQLException: "+ex);
        }
        log.info("Utente trovato: {} "+u.getClass().toString());
        return Optional.empty();
    }

    // UPDATE

    public void update(Utente u){
        String sql = "UPDATE public.utente SET nome_user = ?, cognome = ?, email = ?, indirizzo_user = ? ";

        DBHelper.executeUpdate(sql, ps ->{
            ps.setString(1, u.getNomeUser());
            ps.setString(2, u.getCognome());
            ps.setString(3, u.getEmail());
            ps.setString(4, u.getIndirizzoUser());
        });
        log.info("utente update {} : "+ u.toString());
    }

    // DELETE

    public int deleteAll(){
        String sql = "DELETE FROM utente";

        try (Connection conn = DataBaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            int deleted = ps.executeUpdate();
            log.info("Eliminati {} utenti: ", deleted);
            return deleted;

        } catch (SQLException ex) {
            log.error("Errore durante l'eliminazione di tutti gli utenti", ex);
            throw new RuntimeException("SQLException: ", ex);
        }
    }

    public boolean deleteById(Integer id){
        String sql = "DELETE FROM utente WHERE id = ?";

        try (Connection conn = DataBaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

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

    public boolean deleteByUsername(String nomeUser){
        String sql = "DELETE FROM utente WHERE nome_user = ?";

        try (Connection conn = DataBaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

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
