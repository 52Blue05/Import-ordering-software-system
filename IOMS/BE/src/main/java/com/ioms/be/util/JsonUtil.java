package com.ioms.be.util;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.ioms.be.dto.ApiError;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public final class JsonUtil {
    private static final Gson GSON = new GsonBuilder()
            .serializeNulls()
            .setPrettyPrinting()
            .create();

    private JsonUtil() {
    }

    public static void writeJson(HttpServletResponse response, Object body) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        GSON.toJson(body, response.getWriter());
    }

    public static void writeError(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        writeJson(response, new ApiError(status, message));
    }
}
