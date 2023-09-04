package com.ssafy.jarviser.user;

import com.ssafy.jarviser.domain.User;
import com.ssafy.jarviser.dto.RequestUpdateUserDto;
import com.ssafy.jarviser.dto.RequestUserDto;
import com.ssafy.jarviser.dto.ResponseMypageDto;
import com.ssafy.jarviser.service.UserService;
import jakarta.transaction.Transactional;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;

@SpringBootTest
public class UserTest {
    @Autowired
    private UserService us;

    @Test
    @DisplayName("회원 가입 테스팅")
    @Transactional
    @Rollback(value = false)
    void testRegisterUser() throws Exception {
        //given
        RequestUserDto requestUserDto = RequestUserDto.builder().name("wooseok").password("1234").email("wooseok777777@gmail.com").build();
        us.regist(requestUserDto);

        //when
        User user = us.findUserByEmail(requestUserDto.getEmail());

        //then
        Assertions.assertThat(requestUserDto.getName()).isEqualTo(user.getName());
    }

    @Test
    @DisplayName("회원 마이페이지 테스팅")
    @Transactional
    @Rollback(value = false)
    void testMypage() throws Exception{
        //given

        //임의 유저 등록
        RequestUserDto requestUserDto = RequestUserDto.builder().name("wooseok").password("1234").email("wooseok777777@gmail.com").build();
        us.regist(requestUserDto);

        //유저 영속성으로 조회
        User user = us.findUserByEmail(requestUserDto.getEmail());
        ResponseMypageDto mypageUser = us.mypage(user.getId());

        //when
        //then
        Assertions.assertThat(mypageUser.getName()).isEqualTo(user.getName());
        Assertions.assertThat(mypageUser.getEmail()).isEqualTo(user.getEmail());
    }

    @Test
    @DisplayName("회원 정보 수정")
    @Transactional
    @Rollback(value = false)
    void testUpdateUser() throws Exception{
        //given
        //임의 유저 등록
        RequestUserDto requestUserDto = RequestUserDto.builder().name("wooseok").password("1234").email("wooseok777777@gmail.com").build();
        Long userId = us.regist(requestUserDto);

        //when
       RequestUpdateUserDto requestUpdateUserDto = new RequestUpdateUserDto("", "4321");

        //then
       us.updateUser(userId, requestUpdateUserDto);

       Assertions.assertThat(us.findUserById(userId).getName()).isEqualTo("wooseok");
       Assertions.assertThat(us.findUserById(userId).getPassword()).isEqualTo("4321");
    }

    @Test
    @DisplayName("회원 탈퇴")
    @Transactional
    @Rollback(value = false)
    void testDeleteUser() throws Exception{
        //given

        RequestUserDto requestUserDto = new RequestUserDto();
        requestUserDto.setName("wooseok");
        requestUserDto.setPassword("1234");
        requestUserDto.setEmail("wooseok777777@gmail.com");

        us.regist(requestUserDto);

        User user = us.findUserByEmail(requestUserDto.getEmail());
        //when

        us.withdrawal(user.getId());

        //then

        User notFoundUser = us.findUserByEmail("wooseok777777@gmail.com");
        Assertions.assertThat(notFoundUser).isEqualTo(null);
    }
}
