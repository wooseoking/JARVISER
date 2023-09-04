package com.ssafy.jarviser;

import com.fasterxml.jackson.databind.deser.std.StdKeyDeserializer;
import com.ssafy.jarviser.domain.Meeting;
import com.ssafy.jarviser.domain.User;
import com.ssafy.jarviser.dto.RequestLoginDto;
import com.ssafy.jarviser.dto.RequestUpdateUserDto;
import com.ssafy.jarviser.dto.RequestUserDto;
import com.ssafy.jarviser.dto.ResponseMypageDto;
import com.ssafy.jarviser.repository.UserRepository;
import com.ssafy.jarviser.service.UserService;
import jakarta.transaction.Transactional;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.parameters.P;
import org.springframework.test.annotation.Rollback;

import java.time.LocalDateTime;
import java.util.Optional;

@SpringBootTest
class JarviserApplicationTests {
}
