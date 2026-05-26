package com.ioms.be.dto;

public class ApiError {
    public final int status;
    public final String message;

    public ApiError(int status, String message) {
        this.status = status;
        this.message = message;
    }
}
