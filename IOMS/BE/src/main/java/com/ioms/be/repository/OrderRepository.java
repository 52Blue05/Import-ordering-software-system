package com.ioms.be.repository;

import com.ioms.be.config.DatabaseConfig;
import com.ioms.be.dto.OrderDto;

import java.sql.Connection;
import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class OrderRepository {
    public List<OrderDto> findAll() throws SQLException {
        String sql = """
                SELECT o.id,
                       o.order_date,
                       o.status,
                       o.customer,
                       o.total_amount,
                       o.currency,
                       s.site_name,
                       COUNT(oi.id) AS item_count,
                       CASE
                           WHEN o.status IN ('delivered', 'shipped') THEN 'Approved'
                           WHEN o.status IN ('cancelled', 'rejected') THEN 'Rejected'
                           ELSE 'Pending'
                       END AS confirmation_status
                FROM orders o
                JOIN sites s ON s.id = o.site_id
                LEFT JOIN order_items oi ON oi.order_id = o.id
                GROUP BY o.id, o.order_date, o.status, o.customer, o.total_amount, o.currency, s.site_name
                ORDER BY o.order_date DESC, o.id DESC
                """;

        List<OrderDto> orders = new ArrayList<>();
        try (Connection connection = DatabaseConfig.getConnection();
             Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(sql)) {
            while (resultSet.next()) {
                OrderDto order = new OrderDto();
                order.orderCode = resultSet.getString("id");
                Date orderDate = resultSet.getDate("order_date");
                order.submissionDate = orderDate == null ? null : orderDate.toLocalDate().toString();
                order.itemCount = resultSet.getInt("item_count");
                order.confirmationStatus = resultSet.getString("confirmation_status");
                order.status = resultSet.getString("status");
                order.customer = resultSet.getString("customer");
                order.siteName = resultSet.getString("site_name");
                order.totalAmount = resultSet.getLong("total_amount");
                order.currency = resultSet.getString("currency");
                orders.add(order);
            }
        }
        return orders;
    }
}
