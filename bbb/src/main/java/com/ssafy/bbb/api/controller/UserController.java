package com.ssafy.bbb.api.controller;

import com.ssafy.bbb.api.request.InsertUserReq;
import com.ssafy.bbb.api.service.JwtService;
import com.ssafy.bbb.api.service.UserService;
import com.ssafy.bbb.db.domain.User;
import com.ssafy.bbb.exception.NotFoundException;
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
@Api(tags = {"사용자 API"}) //Swagger에 보여줄 명칭
public class UserController {

    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";
    private final UserService userService;

    private final JwtService jwtService;

    //회원가입
    @ApiOperation(value = "회원가입") //해당 Api의 설명
    @PostMapping("/signup")
    public ResponseEntity<String> InsertUser(@Validated @RequestBody InsertUserReq insertUserReq){
        log.debug("회원가입 정보 = {} ", insertUserReq);
        userService.insertUser(insertUserReq);
        return new ResponseEntity<String>(SUCCESS,HttpStatus.OK);
    }

    //로그인
    @ApiOperation(value = "로그인") //해당 Api의 설명
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginMember(@RequestParam("email") String email, @RequestParam("password") String password, HttpSession session) throws NotFoundException {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = null;
        try {
            User loginUser = userService.loginUser(email, password);
            if(loginUser != null) {
                String accessToken = jwtService.createAccessToken("id", loginUser.getId());// key, data
                String refreshToken = jwtService.createRefreshToken("id", loginUser.getId());// key, data
                userService.saveRefreshToken(email, refreshToken);
                log.debug("로그인 accessToken 정보 : {}", accessToken);
                log.debug("로그인 refreshToken 정보 : {}", refreshToken);
                resultMap.put("access-token", accessToken);
                resultMap.put("refresh-token", refreshToken);
                resultMap.put("message", SUCCESS);
                status = HttpStatus.ACCEPTED;

            }
            else {
                resultMap.put("message", FAIL);
                status = HttpStatus.ACCEPTED;
                //model.addAttribute("msg", "로그인 실패 ID 또는 PW를 확인하세요.");
            }
        }catch(Exception e) {
            log.error("로그인 실패 : {}", e);
            resultMap.put("message", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<Map<String, Object>>(resultMap, status);

    }

    //로그아웃
    @ApiOperation(value = "로그아웃") //해당 Api의 설명
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