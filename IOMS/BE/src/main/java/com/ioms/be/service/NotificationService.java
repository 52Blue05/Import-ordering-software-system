package com.ioms.be.service;

import com.ioms.be.dto.NotificationDto;
import com.ioms.be.repository.NotificationRepository;

import java.sql.SQLException;
import java.util.List;

public class NotificationService {
    private final NotificationRepository notificationRepository = new NotificationRepository();

    public List<NotificationDto> getNotifications() throws SQLException {
        return notificationRepository.findAll();
    }
}
