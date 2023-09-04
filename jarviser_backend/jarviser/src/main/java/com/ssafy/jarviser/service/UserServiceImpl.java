package com.ssafy.jarviser.service;

import com.ssafy.jarviser.dto.*;
import com.ssafy.jarviser.domain.User;
import com.ssafy.jarviser.repository.UserRepository;
import com.ssafy.jarviser.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;


@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authenticationManager;
    @Override
    // TODO: 2023-07-25
    public ResponseAuthenticationDto login(RequestLoginDto loginDto) throws Exception {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getEmail(),
                        loginDto.getPassword()
                )
        );

        var user = userRepository.findByEmail(loginDto.getEmail());
        //TODO Optional로 리팩토링
        var jwtToken = jwtService.generateToken(user);
        return ResponseAuthenticationDto.builder()
                .token(jwtToken)
                .build();
    }

    @Override
    public ResponseMypageDto mypage(long userid) throws Exception {
        User user = userRepository.getReferenceById(userid);
        return new ResponseMypageDto(user.getEmail(), user.getName());
    }

    @Override
    public Long regist(RequestUserDto dto) throws Exception {
        dto.setPassword(encoder.encode(dto.getPassword())); //security encode password
        User user = dto.toEntity();
        User savedUser = userRepository.save(user);
        log.info("DB에 회원 저장 성공");
        return savedUser.getId();
    }

    @Override
    public void withdrawal(Long id) throws Exception {
        userRepository.deleteById(id);
    }


    @Override
    public void updateUser(long id, RequestUpdateUserDto updateUserDto) throws Exception {
        User user = userRepository.findById(id).orElse(null);

        assert user!=null;

        if(!updateUserDto.getName().equals("")){
            user.setName(updateUserDto.getName());
        }else{
            user.setName(user.getName());
        }

        if(!updateUserDto.getPassword().equals("")){
            user.setPassword(encoder.encode(updateUserDto.getPassword()));
        }else{
            user.setPassword(user.getPassword());
        }
    }

    @Override
    public User findUserById(Long id) throws Exception {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public User findUserByEmail(String email) throws Exception {
        return userRepository.findByEmail(email);
    }

    @Override
    public Boolean checkUserPassword(RequestLoginDto loginDto) throws Exception {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginDto.getEmail(),
                            loginDto.getPassword()
                    )
            );
            return true;
        }catch (AuthenticationException e){
            return false;
        }

    }

    @Override
    public void uploadImg(long userId,String filePath) throws Exception {
        User user = userRepository.findUserById(userId);
        user.setProfilePictureUrl(filePath);
        userRepository.save(user);
        System.out.println("DB에 저장 성공");
    }
}