package com.ssafy.jarviser.service;

import com.ssafy.jarviser.dto.*;
import com.ssafy.jarviser.domain.User;


public interface UserService {
    //로그인
    ResponseAuthenticationDto login(RequestLoginDto loginDto) throws Exception;
    //마이페이지
    ResponseMypageDto mypage(long id) throws Exception;
    //회원가입
    public Long regist(RequestUserDto dto) throws Exception;
    //회원탈퇴
    public void withdrawal(Long id) throws Exception;
    //회원정보수정
    void updateUser(long id, RequestUpdateUserDto updateUserDto) throws Exception;

    User findUserById(Long id) throws Exception;

    User findUserByEmail(String email) throws Exception;

    Boolean checkUserPassword(RequestLoginDto loginDto) throws Exception;

    //이미지 업로드
    void uploadImg(long userId,String filePath) throws Exception;
}
