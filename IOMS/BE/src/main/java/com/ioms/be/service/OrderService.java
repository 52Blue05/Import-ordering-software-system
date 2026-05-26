package com.ioms.be.service;

import com.ioms.be.dto.OrderDto;
import com.ioms.be.repository.OrderRepository;

import java.sql.SQLException;
import java.util.List;

public class OrderService {
    private final OrderRepository orderRepository = new OrderRepository();

    public List<OrderDto> getOrders() throws SQLException {
        return orderRepository.findAll();
    }
}
