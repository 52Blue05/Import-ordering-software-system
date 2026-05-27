package com.ioms.be.repository;

import com.ioms.be.config.DatabaseConfig;
import com.ioms.be.dto.CreateInventoryRequest;
import com.ioms.be.dto.InventoryDto;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
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
                inventory.add(mapInventory(resultSet));
            }
        }
        return inventory;
    }

    public InventoryDto create(CreateInventoryRequest request) throws SQLException {
        String sql = """
                INSERT INTO inventory (
                    product_code,
                    product_name,
                    category,
                    site_id,
                    unit,
                    quantity_on_hand,
                    quantity_reserved,
                    quantity_available,
                    reorder_level,
                    reorder_quantity,
                    unit_price,
                    supplier,
                    last_restock_date,
                    location
                )
                VALUES (?, ?, ?, ?, ?, ?, 0, ?, 0, 0, ?, ?, ?, ?)
                RETURNING id,
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
                """;

        try (Connection connection = DatabaseConfig.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, request.merchandiseCode);
            statement.setString(2, request.merchandiseName);
            statement.setString(3, blankToDefault(request.category, "General"));
            statement.setString(4, blankToDefault(request.siteId, "SITE-001"));
            statement.setString(5, request.unit);
            statement.setInt(6, request.quantity);
            statement.setInt(7, request.quantity);
            statement.setLong(8, request.unitPrice);
            statement.setString(9, blankToDefault(request.supplier, "Manual Entry"));
            statement.setDate(10, Date.valueOf(request.lastUpdatedDate));
            statement.setString(11, blankToDefault(request.location, request.notes));

            try (ResultSet resultSet = statement.executeQuery()) {
                resultSet.next();
                return mapInventory(resultSet);
            }
        }
    }

    private InventoryDto mapInventory(ResultSet resultSet) throws SQLException {
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
        return item;
    }

    private String blankToDefault(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}
