package com.ssafy.jarviser.controller;

import com.ssafy.jarviser.domain.AudioMessage;

import com.ssafy.jarviser.domain.Meeting;
import com.ssafy.jarviser.domain.User;
import com.ssafy.jarviser.dto.*;
import com.ssafy.jarviser.security.JwtService;
import com.ssafy.jarviser.service.MeetingService;
import com.ssafy.jarviser.service.UserService;
import com.ssafy.jarviser.util.AESEncryptionUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.naming.ldap.PagedResultsControl;
import java.io.File;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/user")
@Slf4j
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;
    private final MeetingService meetingService;
    private final AESEncryptionUtil aesEncryptionUtil;
    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";
    private final ResourceLoader resourceLoader;

    //회원가입
    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signUp(@RequestBody RequestUserDto requestUserDto) {
        log.debug("User............................regist user:" + requestUserDto);

        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = null;

        try {
            userService.regist(requestUserDto);
            resultMap.put("message", SUCCESS);
            status = HttpStatus.ACCEPTED;
            //TODO: ExceptionHandler
        } catch (Exception e) {
            //FIXME : 모든 회원 가입 실패에 대하여 처리가 필요함
            log.error("회원가입 실패 : {}", e);
            resultMap.put("message", FAIL);
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(resultMap, status);
    }

    //로그인
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody RequestLoginDto requestLoginDto) {
        log.debug("User............................regist user:" + requestLoginDto);

        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = null;

        try {
            resultMap.put("message", SUCCESS);
            resultMap.put("access-token", userService.login(requestLoginDto).getToken());
            status = HttpStatus.ACCEPTED;
        } catch (Exception e) {
            //FIXME : 모든 회원 가입 실패에 대하여 처리가 필요함
            log.error("로그인 실패", e);
            resultMap.put("message", "아이디 또는 비밀번호를 다시 입력해주세요.");
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(resultMap, status);
    }

    //회원정보수정
    @PatchMapping("/update")
    public ResponseEntity<Map<String, Object>> update(
            @RequestHeader("Authorization") String token,
            @RequestBody RequestUpdateUserDto requestUpdateUserDto) {

        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = null;
        token = token.split(" ")[1];
        try {
            Long userId = jwtService.extractUserId(token);
            userService.updateUser(userId, requestUpdateUserDto);
            status = HttpStatus.ACCEPTED;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return new ResponseEntity<>(resultMap, status);
    }

    @GetMapping("/{email}")
    public ResponseEntity<Map<String, Object>> checkId(@PathVariable String email){
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = null;
        try {
            User user = userService.findUserByEmail(email);
            if (user == null){
                resultMap.put("message", SUCCESS);
            }else{
                resultMap.put("message", "중복된 이메일 입니다.");
            }
            status = HttpStatus.ACCEPTED;
        } catch (Exception e) {
            //FIXME : 모든 회원 가입 실패에 대하여 처리가 필요함
            log.error("아이디 찾기 오류", e);
            resultMap.put("message", FAIL);
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<>(resultMap, status);
    }
    //마이페이지
    @GetMapping("/mypage")
    public ResponseEntity<Map<String, Object>> mypage(
            @RequestHeader("Authorization") String token) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = null;
        token = token.split(" ")[1];
        try {
            Long userId = jwtService.extractUserId(token);
            ResponseMypageDto responseMypageDto = userService.mypage(userId);
            User user = userService.findUserById(userId);
            String userProfileImgPath = user.getProfilePictureUrl();
            resultMap.put("response",responseMypageDto);
            if(userProfileImgPath!=null){
                String imgPath = user.getProfilePictureUrl();
                resultMap.put("imgPath",imgPath);
            }else{
                resultMap.put("imgPath",null);
            }

            status = HttpStatus.ACCEPTED;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return new ResponseEntity<>(resultMap, status);
    }

    //회원탈퇴
    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, Object>> delete(
            @RequestHeader("Authorization") String token
    ) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = null;
        token = token.split(" ")[1];
        Long userid = jwtService.extractUserId(token);
        try {
            userService.withdrawal(userid);
            status = HttpStatus.ACCEPTED;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return new ResponseEntity<>(resultMap, status);
    }

    //비밀번호 확인
    @PostMapping("/check")
    public ResponseEntity<Map<String,Object>> checkPassword(
            @RequestHeader("Authorization") String token,
            @RequestBody RequestPasswordDto requestPasswordDto
    ){
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = null;
        token = token.split(" ")[1];

        try {
            String email = jwtService.extractUserEmail(token);
            RequestLoginDto requestLoginDto = RequestLoginDto
                    .builder()
                    .email(email)
                    .password(requestPasswordDto.getPassword())
                    .build();

            Boolean ret = userService.checkUserPassword(requestLoginDto);
            resultMap.put("response",ret);
            status = HttpStatus.ACCEPTED;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return new ResponseEntity<>(resultMap, status);
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String,String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String token
    ) throws IOException {


        String uploadDir = "C:\\Users\\SSAFY\\Desktop\\images";
        String originalFilename = file.getOriginalFilename();
        String newFilename = UUID.randomUUID() + "_" + originalFilename;
        File dest = new File(uploadDir + File.separator + newFilename);

        file.transferTo(dest);

        try{
            token = token.split(" ")[1];
            long userId = jwtService.extractUserId(token);
            String imgUrl = dest.getPath();
            userService.uploadImg(userId,imgUrl);
            return new ResponseEntity<>(HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
            throw new RuntimeException("업로드중 서버 에러 발생");
        }
    }

    //이미지 가져오기
    @GetMapping("/myProfileImg")
    public ResponseEntity<Map<String,Object>> getImage(
            @RequestHeader("Authorization") String token
    ) {
        Map<String,Object> response = new HashMap<>();

        try {
            token = token.split(" ")[1];
            long userId = jwtService.extractUserId(token);
            User user = userService.findUserById(userId);
            String userProfileImgPath = user.getProfilePictureUrl();

            Resource resource = resourceLoader.getResource(userProfileImgPath);

            if (resource.exists()) {
                response.put("userProfileImg",resource);
                return new ResponseEntity<>(response,HttpStatus.OK);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    //유저 참여 미팅 내역
    @GetMapping("/meetinglist")
    public ResponseEntity<Map<String, Object>> meetingList(
            @RequestHeader("Authorization") String token
    ) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = null;
        try {
            token = token.split(" ")[1];
            Long userid = jwtService.extractUserId(token);

            List<Meeting> meetingList = meetingService.findMeetingListByUserId(userid);
            List<ResponseMeetingDto> responseMeetingDtos = new ArrayList<>();

            for (Meeting meeting : meetingList) {
                User host = userService.findUserById(meeting.getHostId());
                responseMeetingDtos.add(new ResponseMeetingDto(meeting.getMeetingName(), host.getName(), meeting.getStartTime(), aesEncryptionUtil.encrypt(String.valueOf(meeting.getId()))));
            }
            resultMap.put("meetinglist", responseMeetingDtos);
            status = HttpStatus.ACCEPTED;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return new ResponseEntity<>(resultMap, status);
    }


}