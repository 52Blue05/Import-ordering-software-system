package com.ioms.be.repository;

import com.ioms.be.config.DatabaseConfig;
import com.ioms.be.dto.NotificationDto;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class NotificationRepository {
    public List<NotificationDto> findAll() throws SQLException {
        String sql = """
                SELECT id, type, title, message, timestamp, read
                FROM notifications
                ORDER BY timestamp DESC
                """;

        List<NotificationDto> notifications = new ArrayList<>();
        try (Connection connection = DatabaseConfig.getConnection();
             Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(sql)) {
            while (resultSet.next()) {
                NotificationDto notification = new NotificationDto();
                notification.id = resultSet.getInt("id");
                notification.type = resultSet.getString("type");
                notification.title = resultSet.getString("title");
                notification.message = resultSet.getString("message");
                Timestamp timestamp = resultSet.getTimestamp("timestamp");
                notification.timestamp = timestamp == null ? null : timestamp.toLocalDateTime().toString();
                notification.read = resultSet.getBoolean("read");
                notifications.add(notification);
            }
        }
        return notifications;
    }
}
