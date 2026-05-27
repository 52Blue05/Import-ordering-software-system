package com.ioms.be.controller;

import com.ioms.be.dto.CreateInventoryRequest;
import com.ioms.be.service.InventoryService;
import com.ioms.be.util.JsonUtil;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public class InventoryServlet extends HttpServlet {
    private final InventoryService inventoryService = new InventoryService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            JsonUtil.writeJson(response, inventoryService.getInventory());
        } catch (Exception exception) {
            JsonUtil.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, exception.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            CreateInventoryRequest createRequest = JsonUtil.fromJson(request.getReader(), CreateInventoryRequest.class);
            response.setStatus(HttpServletResponse.SC_CREATED);
            JsonUtil.writeJson(response, inventoryService.createInventoryItem(createRequest));
        } catch (IllegalArgumentException exception) {
            JsonUtil.writeError(response, HttpServletResponse.SC_BAD_REQUEST, exception.getMessage());
        } catch (Exception exception) {
            JsonUtil.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, exception.getMessage());
        }
    }
}
