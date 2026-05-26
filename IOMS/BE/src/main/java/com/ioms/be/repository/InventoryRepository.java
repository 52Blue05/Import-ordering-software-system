package com.ioms.be.repository;

import com.ioms.be.config.DatabaseConfig;
import com.ioms.be.dto.InventoryDto;

import java.sql.Connection;
import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class InventoryRepository {
    public List<InventoryDto> findAll() throws SQLException {
        String sql = """
                SELECT id,
                       product_code,
                       product_name,
                       category,
                       site_id,
                       unit,
                       quantity_on_hand,
                       quantity_available,
                       reorder_level,
                       unit_price,
                       last_restock_date,
                       location
                FROM inventory
                ORDER BY product_code
                """;

        List<InventoryDto> inventory = new ArrayList<>();
        try (Connection connection = DatabaseConfig.getConnection();
             Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(sql)) {
            while (resultSet.next()) {
                InventoryDto item = new InventoryDto();
                item.id = resultSet.getInt("id");
                item.merchandiseCode = resultSet.getString("product_code");
                item.merchandiseName = resultSet.getString("product_name");
                item.category = resultSet.getString("category");
                item.siteId = resultSet.getString("site_id");
                item.unit = resultSet.getString("unit");
                item.quantity = resultSet.getInt("quantity_on_hand");
                item.quantityAvailable = resultSet.getInt("quantity_available");
                item.reorderLevel = resultSet.getInt("reorder_level");
                item.unitPrice = resultSet.getLong("unit_price");
                Date restockDate = resultSet.getDate("last_restock_date");
                item.lastUpdatedDate = restockDate == null ? null : restockDate.toLocalDate().toString();
                item.location = resultSet.getString("location");
                inventory.add(item);
            }
        }
        return inventory;
    }
}
