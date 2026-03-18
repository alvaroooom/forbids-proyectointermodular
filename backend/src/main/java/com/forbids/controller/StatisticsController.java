package com.forbids.controller;

import com.forbids.dto.UserStatisticsResponse;
import com.forbids.model.User;
import com.forbids.repository.UserRepository;
import com.forbids.service.JwtService;
import com.forbids.service.StatisticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    private final StatisticsService statisticsService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public StatisticsController(StatisticsService statisticsService,
                              JwtService jwtService,
                              UserRepository userRepository) {
        this.statisticsService = statisticsService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<UserStatisticsResponse> getMyStatistics(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtService.extractUserId(token);

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        UserStatisticsResponse statistics = statisticsService.getUserStatistics(user);

        return ResponseEntity.ok(statistics);
    }
}
