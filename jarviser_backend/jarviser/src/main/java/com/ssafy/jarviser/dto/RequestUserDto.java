package com.ssafy.jarviser.dto;

import com.ssafy.jarviser.domain.Role;
import com.ssafy.jarviser.domain.User;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@Builder

public class RequestUserDto {

    private String password;

    private String name;

    private String email;

    private String provider;

    private String providedId;

    public User toEntity() {
        return User.builder()
                .email(email)
                .password(password)
                .name(name)
                .role(Role.USER)
                .build();
    }

    @Builder
    public RequestUserDto(String password, String name, String email, String provider, String providedId) {
        this.password = password;
        this.name = name;
        this.email = email;
        this.provider = provider;
        this.providedId = providedId;
    }


}
