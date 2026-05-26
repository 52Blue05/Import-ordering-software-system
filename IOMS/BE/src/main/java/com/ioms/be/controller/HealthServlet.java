package com.ioms.be.controller;

import com.ioms.be.util.JsonUtil;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;

public class HealthServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        JsonUtil.writeJson(response, Map.of(
                "status", "ready",
                "service", "IOMS Backend",
                "timestamp", Instant.now().toString()
        ));
    }
}
