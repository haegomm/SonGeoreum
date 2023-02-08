package com.bbb.songeoreum.api.controller;

import com.bbb.songeoreum.api.request.InsertUserReq;
import com.bbb.songeoreum.api.request.LoginReq;
import com.bbb.songeoreum.api.response.LoginRes;
import com.bbb.songeoreum.api.service.JwtService;
import com.bbb.songeoreum.api.service.UserService;
import com.bbb.songeoreum.config.AppProperties;
import com.bbb.songeoreum.db.domain.User;
import com.bbb.songeoreum.exception.DuplicateException;
import com.bbb.songeoreum.exception.NotFoundException;
import com.bbb.songeoreum.jwt.AuthToken;
import com.bbb.songeoreum.jwt.AuthTokenProvider;
import com.bbb.songeoreum.util.CookieUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static com.bbb.songeoreum.db.repository.OAuth2AuthorizationRequestBasedOnCookieRepository.REFRESH_TOKEN;

@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Api(tags = {"사용자 API"}) // Swagger에 보여줄 명칭
public class UserController {

    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";

    private final UserService userService;

    private final JwtService jwtService;

    private final AuthTokenProvider tokenProvider;
    private final AppProperties appProperties;


    // 이메일 중복체크
    @ApiOperation(value = "이메일 중복체크")
    @GetMapping("/signup/email/{email}")
    public ResponseEntity<String> duplicateEmail(@PathVariable("email") String email) throws DuplicateException {

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
    @GetMapping("/signup/nickname/{nickname}")
    public ResponseEntity<String> duplicateNickname(@PathVariable("nickname") String nickname) throws DuplicateException {

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
    public ResponseEntity<String> insertUser(@Valid @RequestBody InsertUserReq insertUserReq) {

        log.debug("회원가입 정보 = {} ", insertUserReq);
        userService.insertUser(insertUserReq);
        return new ResponseEntity<String>(SUCCESS, HttpStatus.OK);
    }

    // 로그인
    @ApiOperation(value = "로그인") // 해당 Api의 설명
    @PostMapping("/login")
    public ResponseEntity<LoginRes> loginUser(@Valid @RequestBody LoginReq loginReq, HttpServletRequest request, HttpServletResponse response) throws NotFoundException {

        log.debug("로그인 요청 들어옴.");

        HttpStatus status = null;
        LoginRes loginRes = null; // 리턴값

        try {
            User loginUser = userService.loginUser(loginReq.getEmail(), loginReq.getPassword());

            Date now = new Date();

            // access 토큰 발급
            AuthToken accessToken = tokenProvider.createAuthToken(
                    loginUser.getId(), // access 토큰에 user pk 저장
                    loginUser.getNickname(),
                    "ROLE_USER",
                    new Date(now.getTime() + appProperties.getAuth().getTokenExpiry())
            );

            // refreshToken 기한
            long refreshTokenExpiry = appProperties.getAuth().getRefreshTokenExpiry();

            // refresh 토큰 발급
            AuthToken refreshToken = tokenProvider.createAuthToken(
                    appProperties.getAuth().getTokenSecret(),
                    new Date(now.getTime() + refreshTokenExpiry)
            );

            log.debug("일반 user 로그인 accessToken 정보 : {}", accessToken.getToken());
            log.debug("일반 user 로그인 refreshToken 정보 : {}", refreshToken.getToken());

            // refresh token DB에 저장
            userService.saveRefreshToken(loginUser.getId(), refreshToken.getToken());

            loginRes = LoginRes.builder()
                    .id(loginUser.getId())
                    .userType(loginUser.getUserType())
                    .email(loginUser.getEmail())
                    .nickname(loginUser.getNickname())
                    .picture(loginUser.getPicture())
                    .level(loginUser.getLevel())
                    .experience(loginUser.getExperience())
                    .accessToken(accessToken.getToken())
                    .message(SUCCESS)
                    .build();

            // 쿠키 기한
            int cookieMaxAge = (int) refreshTokenExpiry / 60;

            // 쿠키를 왜 delete를 하는지는 잘 모르겠음. 찾아봐야겠음.
            CookieUtil.deleteCookie(request, response, REFRESH_TOKEN);
            // response에 쿠키 담아줌.
            CookieUtil.addCookie(response, REFRESH_TOKEN, refreshToken.getToken(), cookieMaxAge);

            status = HttpStatus.ACCEPTED;


        } catch (Exception e) {
            log.error("로그인 실패 : {}", e.getMessage());
            loginRes = LoginRes.builder().message(FAIL).build();
            status = HttpStatus.NOT_FOUND;
        }

        return new ResponseEntity<LoginRes>(loginRes, status);
    }

    //로그아웃
    @ApiOperation(value = "로그아웃") // 해당 Api의 설명
    @GetMapping("/logout/{id}")
    public ResponseEntity<Map<String, Object>> logoutUser(@PathVariable("id") Long id, HttpSession session) {

        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            userService.deleteRefreshToken(id);
            resultMap.put("message", SUCCESS);
            status = HttpStatus.ACCEPTED;
        } catch (Exception e) {
            log.error("로그아웃 실패 : {}", e);
            resultMap.put("message", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @ApiOperation(value = "Access Token 재발급", notes = "만료된 access token을 재발급받는다.", response = Map.class)
    @PostMapping("/refresh/{id}")
    public ResponseEntity<?> refreshToken(@PathVariable("id") Long id, HttpServletRequest request)
            throws Exception {

        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.ACCEPTED;
        String token = request.getHeader("refreshToken");

        log.debug("token : {}, id : {}", token, id);

        if (jwtService.checkToken(token)) {
            if (token.equals(userService.getRefreshToken(id).getRefreshToken())) {
                String accessToken = jwtService.createAccessToken("email", id);
                log.debug("accessToken : {}", accessToken);
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
