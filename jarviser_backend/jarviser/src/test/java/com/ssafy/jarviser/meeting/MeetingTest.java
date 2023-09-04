package com.ssafy.jarviser.meeting;

import com.ssafy.jarviser.domain.AudioMessage;
import com.ssafy.jarviser.domain.Meeting;
import com.ssafy.jarviser.domain.User;
import com.ssafy.jarviser.dto.RequestUserDto;
import com.ssafy.jarviser.service.MeetingService;
import com.ssafy.jarviser.service.UserService;
import com.ssafy.jarviser.util.AESEncryptionUtil;
import jakarta.transaction.Transactional;
import org.assertj.core.api.Assertions;
import org.springframework.boot.test.context.SpringBootTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;
import java.time.LocalDateTime;
import java.util.List;


@SpringBootTest
public class MeetingTest {
    @Autowired UserService us;
    @Autowired MeetingService ms;
    @Autowired AESEncryptionUtil aesutil;

}
