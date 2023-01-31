package com.bbb.pjtname.api.controller;

import com.bbb.pjtname.api.request.InsertUserReq;
import com.bbb.pjtname.api.service.JwtService;
import com.bbb.pjtname.api.service.UserService;
import com.bbb.pjtname.db.domain.User;
import com.bbb.pjtname.exception.DuplicateException;
import com.bbb.pjtname.exception.NotFoundException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Api(tags = {"사용자 API"}) // Swagger에 보여줄 명칭
public class UserController {

    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";

    private final UserService userService;

    private final JwtService jwtService;


    // 이메일 중복체크
    @ApiOperation(value = "이메일 중복체크")
    @GetMapping("/signup/email")
    public ResponseEntity<String> duplicateEmail(@RequestParam("email") String email) throws DuplicateException {

        log.debug("중복체크 요청 이메일 = {}", email);

        try {
            userService.duplicateEmail(email);
            return new ResponseEntity<String>(SUCCESS, HttpStatus.OK);
        } catch (DuplicateException e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(FAIL, HttpStatus.CONFLICT);
        }
    }

    // 닉네임 중복체크
    @ApiOperation(value = "닉네임 중복체크")
    @GetMapping("/signup/nickname")
    public ResponseEntity<String> duplicateNickname(@RequestParam("nickname") String nickname) throws DuplicateException {

        log.debug("중복체크 요청 닉네임 = {}", nickname);

        try {
            userService.duplicateNickname(nickname);
            return new ResponseEntity<String>(SUCCESS, HttpStatus.OK);
        } catch (DuplicateException e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(FAIL, HttpStatus.CONFLICT);
        }
    }

    // 회원가입
    @ApiOperation(value = "회원가입") // 해당 Api의 설명
    @PostMapping("/signup")
    public ResponseEntity<String> insertUser(@Validated @RequestBody InsertUserReq insertUserReq) {

        log.debug("회원가입 정보 = {} ", insertUserReq);
        userService.insertUser(insertUserReq);
        return new ResponseEntity<String>(SUCCESS, HttpStatus.OK);
    }

    // 로그인
    @ApiOperation(value = "로그인") // 해당 Api의 설명
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginMember(@RequestParam("email") String email, @RequestParam("password") String password, HttpSession session) throws NotFoundException {

        log.debug("로그인 요청 들어옴.");

        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = null;

        try {
            User loginUser = userService.loginUser(email, password);
            if (loginUser != null) {
                String accessToken = jwtService.createAccessToken("id", loginUser.getId());// key, data
                String refreshToken = jwtService.createRefreshToken("id", loginUser.getId());// key, data
                userService.saveRefreshToken(email, refreshToken);
                log.debug("로그인 accessToken 정보 : {}", accessToken);
                log.debug("로그인 refreshToken 정보 : {}", refreshToken);
                resultMap.put("access-token", accessToken);
                resultMap.put("refresh-token", refreshToken);
                resultMap.put("message", SUCCESS);
                status = HttpStatus.ACCEPTED;

            } else {
                resultMap.put("message", FAIL);
                status = HttpStatus.ACCEPTED;
                // model.addAttribute("msg", "로그인 실패 ID 또는 PW를 확인하세요.");
            }
        } catch (Exception e) {
            log.error("로그인 실패 : {}", e);
            resultMap.put("message", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<Map<String, Object>>(resultMap, status);

    }

    //로그아웃
    @ApiOperation(value = "로그아웃") // 해당 Api의 설명
    @GetMapping("/logout")
    public ResponseEntity<Map<String, Object>> logoutUser(@RequestParam("email") String email, HttpSession session) {

        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            userService.deleteRefreshToken(email);
            resultMap.put("message", SUCCESS);
            status = HttpStatus.ACCEPTED;
        } catch (Exception e) {
            log.error("로그아웃 실패 : {}", e);
            resultMap.put("message", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
//		session.invalidate();
//		return new ResponseEntity<String>(SUCCESS, HttpStatus.OK);
    }

    @ApiOperation(value = "Access Token 재발급", notes = "만료된 access token을 재발급받는다.", response = Map.class)
    @PostMapping("/refresh/{email}")
    public ResponseEntity<?> refreshToken(@PathVariable("email") String email, HttpServletRequest request)
            throws Exception {

        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.ACCEPTED;
        String token = request.getHeader("refresh-token");

        log.debug("token : {}, id : {}", token, email);

        if (jwtService.checkToken(token)) {
            if (token.equals(userService.getRefreshToken(email).getRefreshToken())) {
                String accessToken = jwtService.createAccessToken("email", email);
                log.debug("utoken : {}", accessToken);
                log.debug("정상적으로 액세스토큰 재발급!!!");
                resultMap.put("access-token", accessToken);
                resultMap.put("message", SUCCESS);
                status = HttpStatus.ACCEPTED;
            }
        } else {
            log.debug("리프레쉬토큰도 사용불!!!!!!!");
            status = HttpStatus.UNAUTHORIZED;
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }
}
