package com.ssafy.jarviser.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {


    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // /topic 아래에 있는 모든 경로를 구독 가능한 주제로 간주하고 브로드캐스팅
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app"); //라우팅
    }

    //클라이언트가 webSocket 서버에 접속할 수 있도록 엔드포인트 설정
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOrigins("http://localhost:3000", "http://70.12.247.36:3000", "https://i9a506.p.ssafy.io:4443").withSockJS();
    }
}
