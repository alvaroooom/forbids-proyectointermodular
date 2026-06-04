package com.forbids.controller;

import com.forbids.dto.UserStatisticsResponse;
import com.forbids.model.User;
import com.forbids.service.AuthContextService;
import com.forbids.service.StatisticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    private final StatisticsService statisticsService;
    private final AuthContextService authContextService;

    public StatisticsController(StatisticsService statisticsService, AuthContextService authContextService) {
        this.statisticsService = statisticsService;
        this.authContextService = authContextService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserStatisticsResponse> getMyStatistics() {
        User user = authContextService.getCurrentUser();
        return ResponseEntity.ok(statisticsService.getUserStatistics(user));
    }
}
