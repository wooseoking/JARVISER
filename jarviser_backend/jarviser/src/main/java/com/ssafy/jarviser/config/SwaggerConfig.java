package com.ssafy.jarviser.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
//
//@Configuration
//public class SwaggerConfig {
//    private static final String SECURITY_SCHEME_NAME = "authorization";	// 추가
//
//    @Bean
//    public OpenAPI swaggerApi() {
//        return new OpenAPI()
//                .components(new Components()
//                        // 여기부터 추가 부분
//                        .addSecuritySchemes(SECURITY_SCHEME_NAME, new SecurityScheme()
//                                .name(SECURITY_SCHEME_NAME)
//                                .type(SecurityScheme.Type.HTTP)
//                                .scheme("bearer")
//                                .bearerFormat("JWT")))
//                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME));
//    }
//}
