package com.ioms.be.dto;

import java.util.List;

public class DashboardResponse {
    public final List<StatCard> stats;
    public final List<TrendPoint> orderTrend;
    public final List<StatusPoint> orderStatus;

    public DashboardResponse(List<StatCard> stats, List<TrendPoint> orderTrend, List<StatusPoint> orderStatus) {
        this.stats = stats;
        this.orderTrend = orderTrend;
        this.orderStatus = orderStatus;
    }

    public static class StatCard {
        public final String label;
        public final int value;
        public final String change;
        public final String icon;
        public final String tone;

        public StatCard(String label, int value, String change, String icon, String tone) {
            this.label = label;
            this.value = value;
            this.change = change;
            this.icon = icon;
            this.tone = tone;
        }
    }

    public static class TrendPoint {
        public final String label;
        public final int orders;
        public final int importRequests;

        public TrendPoint(String label, int orders, int importRequests) {
            this.label = label;
            this.orders = orders;
            this.importRequests = importRequests;
        }
    }

    public static class StatusPoint {
        public final String label;
        public final int value;

        public StatusPoint(String label, int value) {
            this.label = label;
            this.value = value;
        }
    }
}
