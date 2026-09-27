package com.worksphere.worksphere.controller;

import com.worksphere.worksphere.service.AiAnalyticsService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/ai/analytics")
public class AiAnalyticsController {

    private final AiAnalyticsService aiAnalyticsService;

    public AiAnalyticsController(AiAnalyticsService aiAnalyticsService) {
        this.aiAnalyticsService = aiAnalyticsService;
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_HR')")
    @GetMapping("/attendance")
    public Map<String, Object> getAttendanceAnalytics() {
        return aiAnalyticsService.getAttendanceAnalytics();
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_HR')")
    @GetMapping("/attendance/explanation")
    public String getAttendanceExplanation() {
        return aiAnalyticsService.explainAttendanceAnalytics();
    }
}