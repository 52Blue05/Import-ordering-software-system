package com.ioms.be.service;

import com.ioms.be.dto.CreateInventoryRequest;
import com.ioms.be.dto.InventoryDto;
import com.ioms.be.repository.InventoryRepository;

import java.sql.SQLException;
import java.util.List;

public class InventoryService {
    private final InventoryRepository inventoryRepository = new InventoryRepository();

    public List<InventoryDto> getInventory() throws SQLException {
        return inventoryRepository.findAll();
    }

    public InventoryDto createInventoryItem(CreateInventoryRequest request) throws SQLException {
        validate(request);
        return inventoryRepository.create(request);
    }

    private void validate(CreateInventoryRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request body is required");
        }
        if (isBlank(request.merchandiseCode)) {
            throw new IllegalArgumentException("Merchandise code is required");
        }
        if (isBlank(request.merchandiseName)) {
            throw new IllegalArgumentException("Merchandise name is required");
        }
        if (isBlank(request.unit)) {
            throw new IllegalArgumentException("Unit is required");
        }
        if (request.quantity < 0) {
            throw new IllegalArgumentException("Quantity must be greater than or equal to 0");
        }
        if (isBlank(request.lastUpdatedDate)) {
            throw new IllegalArgumentException("Last updated date is required");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
