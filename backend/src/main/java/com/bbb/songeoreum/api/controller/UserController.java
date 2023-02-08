package com.bbb.songeoreum.api.controller;

import com.bbb.songeoreum.api.request.InsertUserReq;
import com.bbb.songeoreum.api.request.LoginReq;
import com.bbb.songeoreum.api.request.UpdateUserReq;
import com.bbb.songeoreum.api.response.*;
import com.bbb.songeoreum.api.service.JwtService;
import com.bbb.songeoreum.api.service.UserService;
import com.bbb.songeoreum.config.AppProperties;
import com.bbb.songeoreum.db.domain.User;
import com.bbb.songeoreum.exception.DuplicateException;
import com.bbb.songeoreum.exception.NotFoundException;
import com.bbb.songeoreum.jwt.AuthToken;
import com.bbb.songeoreum.jwt.AuthTokenProvider;
import com.bbb.songeoreum.jwt.common.ApiResponse;
import com.bbb.songeoreum.oauth.entity.RoleType;
import com.bbb.songeoreum.util.CookieUtil;
import com.bbb.songeoreum.util.HeaderUtil;
import io.jsonwebtoken.Claims;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
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
            return new ResponseEntity<String>(FAIL, HttpStatus.CONFLICT);
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
            return new ResponseEntity<String>(FAIL, HttpStatus.CONFLICT);
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
    @GetMapping("/logout")
    public ResponseEntity<LogoutRes> logoutUser(HttpServletRequest request, HttpServletResponse response) {

        User user = (User) request.getAttribute("user"); // 로그아웃 요청한 user

        HttpStatus status = HttpStatus.ACCEPTED;
        LogoutRes logoutRes = null; // 리턴값

        try {
            userService.deleteRefreshToken(user.getId());
            CookieUtil.deleteCookie(request, response, REFRESH_TOKEN);
            logoutRes = LogoutRes.builder().message(SUCCESS).build();
            status = HttpStatus.ACCEPTED;
        } catch (Exception e) {
            log.error("로그아웃 실패 : {}", e);
            logoutRes = LogoutRes.builder().message(FAIL).build();
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<LogoutRes>(logoutRes, status);
    }

    @ApiOperation(value = "Access Token 재발급", notes = "만료된 access token을 재발급받는다.", response = Map.class)
    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenRes> refreshToken(HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        User user = (User) request.getAttribute("user"); // access token 재발급 요청한 user

        RefreshTokenRes refreshTokenRes = null; // 리턴 값
        HttpStatus status = HttpStatus.ACCEPTED;

        //////////////////////// 이 부분부터
        // access token 확인
        String accessTokenCheck = HeaderUtil.getAccessToken(request);
        AuthToken authToken = tokenProvider.convertAuthToken(accessTokenCheck);
        if (!authToken.validate()) {
            log.debug("유효하지 않은 access token 입니다.");
            refreshTokenRes = RefreshTokenRes.builder().message(FAIL).build();
            status = HttpStatus.UNAUTHORIZED;
//            return ApiResponse.invalidAccessToken();
            return new ResponseEntity<RefreshTokenRes>(refreshTokenRes, status);
        }

        // expired access token 인지 확인
        Claims claims = authToken.getExpiredTokenClaims();
        if (claims == null) {
            log.debug("만료되지 않은 access token 입니다.");
            refreshTokenRes = RefreshTokenRes.builder().message(FAIL).build();
            status = HttpStatus.UNAUTHORIZED;
//            return ApiResponse.notExpiredTokenYet();
            return new ResponseEntity<RefreshTokenRes>(refreshTokenRes, status);
        }
        ///////////////////////// 이 부분까지 tokenAccessDeniedHandler를 넣어줄거라 필요한 부분인지 정확히 모르겠어요..

        // refresh token
        String refreshToken = CookieUtil.getCookie(request, REFRESH_TOKEN)
                .map(Cookie::getValue)
                .orElse(null);

        AuthToken authRefreshToken = tokenProvider.convertAuthToken(refreshToken);

        if (!authRefreshToken.validate() || user.getRefreshToken() == null) {
            log.debug("유효하지 않은 refresh token 입니다.");
            refreshTokenRes = RefreshTokenRes.builder().message(FAIL).build();
//            refreshTokenRes = RefreshTokenRes.builder().message("유효하지 않은 refresh token 입니다.").build();
            status = HttpStatus.UNAUTHORIZED;
//            return ApiResponse.invalidRefreshToken();
            return new ResponseEntity<RefreshTokenRes>(refreshTokenRes, status);
        }

        //

        Date now = new Date();

        // access 토큰 발급
        AuthToken accessToken = tokenProvider.createAuthToken(
                user.getId(), // access 토큰에 user pk 저장
                user.getNickname(),
                "ROLE_USER",
                new Date(now.getTime() + appProperties.getAuth().getTokenExpiry())
        );

        log.debug("정상적으로 액세스토큰 재발급!!!");
        refreshTokenRes = RefreshTokenRes.builder().message(SUCCESS).accessToken(accessToken.getToken()).build();
        status = HttpStatus.ACCEPTED;


//        return ApiResponse.success("token", newAccessToken.getToken());
        return new ResponseEntity<RefreshTokenRes>(refreshTokenRes, status);
    }

    // 회원 정보 조회
    // 일반, 카카오톡 사용자 모두 조회할 수 있도록 email, kakaoId 모두 반환해줌.
    @ApiOperation(value = "회원 정보 조회") // 해당 Api의 설명
    @GetMapping("/profile")
    public ResponseEntity<GetUserRes> getUser(HttpServletRequest request, HttpServletResponse response) {
        User user = (User) request.getAttribute("user");

        GetUserRes getUserRes = userService.getUser(user.getId());

        return new ResponseEntity<GetUserRes>(getUserRes, HttpStatus.OK);
    }

    // 프로필 수정
    @ApiOperation(value = "프로필 수정")
    @PutMapping("/profile")
    public ResponseEntity<String> updateUser(@Valid @RequestBody UpdateUserReq updateUserReq, HttpServletRequest request, HttpServletResponse response) {

        User user = (User) request.getAttribute("user");

        userService.updateUser(updateUserReq, user);

        return new ResponseEntity<String>(SUCCESS, HttpStatus.OK);

    }

    // 게임 결과 경험치 반영
    @ApiOperation(value = "게임 결과 경험치 반영")
    @PutMapping("/game/{experience}")
    public ResponseEntity<UpdateExperienceRes> updateExperience(@PathVariable("experience") int experience, HttpServletRequest request, HttpServletResponse response) {
        User user = (User) request.getAttribute("user");

        UpdateExperienceRes updateExperienceRes = userService.updateExperience(user, experience);

        return new ResponseEntity<UpdateExperienceRes>(updateExperienceRes, HttpStatus.OK);

    }

}
