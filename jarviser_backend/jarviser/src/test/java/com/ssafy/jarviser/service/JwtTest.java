package com.ssafy.jarviser.service;

import com.ssafy.jarviser.security.JwtService;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@Slf4j
public class JwtTest {

    @Autowired
    JwtService jwtService;

    private final String token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoic3RyaW5nIiwic3ViIjoic3RyaW5nIiwiaWF0IjoxNjkwOTY0NDgxLCJleHAiOjE2OTA5NzUyODF9.07udc0-NcjAB391FepX8Zwrc7XYxpYEicVSJ_pIJW7k";

        @Test
        public void test() {
            String name = jwtService.extractUserName(token);
            Long id = jwtService.extractUserId(token);

            assertNotNull(name);
            assertNotNull(id);

            log.info("name : " + name);
            log.info("id : " + id);
        }
}
