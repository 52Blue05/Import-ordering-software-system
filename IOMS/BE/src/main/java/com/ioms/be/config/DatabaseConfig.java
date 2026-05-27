package com.ioms.be.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public final class DatabaseConfig {
    private static final String DEFAULT_URL = "jdbc:postgresql://localhost:5432/ioms";
    private static final String DEFAULT_USER = "postgres";
    private static final String DEFAULT_PASSWORD = "300905";

    static {
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException exception) {
            throw new IllegalStateException("PostgreSQL JDBC driver is not available", exception);
        }
    }

    private DatabaseConfig() {
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(
                env("IOMS_DB_URL", DEFAULT_URL),
                env("IOMS_DB_USER", DEFAULT_USER),
                env("IOMS_DB_PASSWORD", DEFAULT_PASSWORD));
    }

    private static String env(String key, String fallback) {
        String value = System.getenv(key);
        return value == null || value.isBlank() ? fallback : value;
    }
}
