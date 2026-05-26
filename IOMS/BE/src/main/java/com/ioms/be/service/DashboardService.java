package com.ioms.be.service;

import com.ioms.be.dto.DashboardResponse;
import com.ioms.be.repository.DashboardRepository;

import java.sql.SQLException;

public class DashboardService {
    private final DashboardRepository dashboardRepository = new DashboardRepository();

    public DashboardResponse getDashboard() throws SQLException {
        return new DashboardResponse(
                dashboardRepository.getStats(),
                dashboardRepository.getOrderTrend(),
                dashboardRepository.getOrderStatus()
        );
    }
}
