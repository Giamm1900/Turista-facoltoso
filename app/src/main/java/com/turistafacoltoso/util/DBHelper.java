package com.turistafacoltoso.util;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class DBHelper {
    @FunctionalInterface
    public interface SQLConsumer {
        void accept(PreparedStatement ps) throws SQLException;
    }

    public static void executeUpdate(String sql, SQLConsumer consumer) {
        try (Connection conn = DataBaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            consumer.accept(ps);
            ps.executeUpdate();
            log.info("sql");
            
        } catch (SQLException e) {
            log.error("SQLException DBHelper: "+e);
            e.printStackTrace();
        }
    }
}
