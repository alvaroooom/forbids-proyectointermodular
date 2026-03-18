package com.forbids;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ForbidsApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ForbidsApiApplication.class, args);
    }
}
