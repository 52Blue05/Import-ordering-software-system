package com.ioms.be.repository;

import com.ioms.be.config.DatabaseConfig;
import com.ioms.be.dto.DashboardResponse.StatCard;
import com.ioms.be.dto.DashboardResponse.StatusPoint;
import com.ioms.be.dto.DashboardResponse.TrendPoint;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class DashboardRepository {
    public List<StatCard> getStats() throws SQLException {
        String sql = """
                SELECT
                    (SELECT COUNT(*) FROM import_requests) AS import_requests,
                    (SELECT COUNT(*) FROM orders) AS orders,
                    (SELECT COUNT(*) FROM orders WHERE status IN ('confirmed', 'pending', 'pending_inspection', 'in_progress')) AS pending_orders,
                    (SELECT COUNT(*) FROM orders WHERE status IN ('delivered', 'completed')) AS completed_orders
                """;

        try (Connection connection = DatabaseConfig.getConnection();
             Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(sql)) {
            resultSet.next();

            List<StatCard> stats = new ArrayList<>();
            stats.add(new StatCard("Total Import Requests", resultSet.getInt("import_requests"), "+12%", "Package", "success"));
            stats.add(new StatCard("Total Orders", resultSet.getInt("orders"), "+8%", "CircleCheck", "success"));
            stats.add(new StatCard("Pending Orders", resultSet.getInt("pending_orders"), "-5%", "Clock", "danger"));
            stats.add(new StatCard("Completed Orders", resultSet.getInt("completed_orders"), "+15%", "CircleCheckBig", "success"));
            return stats;
        }
    }

    public List<TrendPoint> getOrderTrend() throws SQLException {
        String sql = """
                SELECT day_value,
                       TO_CHAR(day_value, 'MM-DD') AS label,
                       COALESCE(order_count, 0) AS orders,
                       COALESCE(import_count, 0) AS import_requests
                FROM (
                    SELECT COALESCE(o.day_value, i.day_value) AS day_value,
                           o.order_count,
                           i.import_count
                    FROM (
                        SELECT order_date AS day_value, COUNT(*) AS order_count
                        FROM orders
                        GROUP BY order_date
                    ) o
                    FULL OUTER JOIN (
                        SELECT request_date AS day_value, COUNT(*) AS import_count
                        FROM import_requests
                        GROUP BY request_date
                    ) i ON o.day_value = i.day_value
                ) trend
                ORDER BY day_value
                LIMIT 8
                """;

        List<TrendPoint> points = new ArrayList<>();
        try (Connection connection = DatabaseConfig.getConnection();
             Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(sql)) {
            while (resultSet.next()) {
                points.add(new TrendPoint(
                        resultSet.getString("label"),
                        resultSet.getInt("orders"),
                        resultSet.getInt("import_requests")
                ));
            }
        }
        return points;
    }

    public List<StatusPoint> getOrderStatus() throws SQLException {
        String sql = """
                SELECT status, COUNT(*) AS total
                FROM orders
                GROUP BY status
                ORDER BY status
                """;

        List<StatusPoint> points = new ArrayList<>();
        try (Connection connection = DatabaseConfig.getConnection();
             Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(sql)) {
            while (resultSet.next()) {
                points.add(new StatusPoint(resultSet.getString("status"), resultSet.getInt("total")));
            }
        }
        return points;
    }
}
