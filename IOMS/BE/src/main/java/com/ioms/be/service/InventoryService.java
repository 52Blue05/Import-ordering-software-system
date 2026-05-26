package com.ioms.be.service;

import com.ioms.be.dto.InventoryDto;
import com.ioms.be.repository.InventoryRepository;

import java.sql.SQLException;
import java.util.List;

public class InventoryService {
    private final InventoryRepository inventoryRepository = new InventoryRepository();

    public List<InventoryDto> getInventory() throws SQLException {
        return inventoryRepository.findAll();
    }
}
