package com.ssafy.jarviser.config;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class MeetingEncryptConfig {
    @Value("${jarviserEncrypt.secretKey}")
    private String secretKey;
}
