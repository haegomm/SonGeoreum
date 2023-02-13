package com.bbb.songeoreum.api.controller;

import com.bbb.songeoreum.api.request.InsertUserReq;
import com.bbb.songeoreum.api.request.LoginReq;
import com.bbb.songeoreum.api.request.UpdateUserReq;
import com.bbb.songeoreum.api.response.*;
import com.bbb.songeoreum.api.service.AuthService;
import com.bbb.songeoreum.api.service.UserService;
import com.bbb.songeoreum.config.AppProperties;
import com.bbb.songeoreum.db.domain.User;
import com.bbb.songeoreum.exception.DuplicateException;
import com.bbb.songeoreum.exception.NotFoundException;
import com.bbb.songeoreum.exception.UnAuthorizedException;
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

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.Date;
import java.util.List;
import java.util.Map;

import static com.bbb.songeoreum.db.repository.OAuth2AuthorizationRequestBasedOnCookieRepository.REFRESH_TOKEN;

/**
 * {@code UserController}는 회원과 관련된 API를 처리하는 컨트롤러입니다.
 *
 * @author wjdwn03
 * @version 1.0
 */
@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Api(tags = {"사용자 API"})
public class UserController {

    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";

    private final UserService userService;
    private final AuthService authService;

    private final AuthTokenProvider tokenProvider;
    private final AppProperties appProperties;

    /**
     * 카카오 로그인을 진행합니다.
     *
     * @param code 카카오에게 받은 인가 코드
     * @return 성공 시 DB에 저장된 kakao 사용자 정보를 {@code ResponseEntity} 로 반환합니다.
     * @throws NotFoundException
     * @throws IllegalArgumentException
     */
    @ApiOperation(value = "카카오 로그인")
    @GetMapping("/oauth2/kakao")
    public ResponseEntity<KakaoLoginRes> kakaoLogin(@RequestParam("code") String code, HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws NotFoundException, IllegalArgumentException {

        log.debug("카카오 user 로그인");

        String kakaoAccessToken = authService.getKakaoAccessToken(code);
        log.debug("카카오에서 accessToken 받아옴 : {}", kakaoAccessToken);
        ResponseEntity<KakaoLoginRes> kakaoLoginRes = authService.kakaoLogin(kakaoAccessToken, httpServletRequest, httpServletResponse);
        log.debug("카카오 로그인 user 닉네임 : {}", kakaoLoginRes.getBody().getNickname());
        return kakaoLoginRes;
    }

    /**
     * 이메일 중복체크
     *
     * @param email 중복체크 요청한 이메일
     * @return 성공 시 성공메시지를 {@code ResponseEntity}로 반환합니다
     * @throws DuplicateException
     */
    @ApiOperation(value = "이메일 중복체크")
    @GetMapping("/signup/email/{email}")
    public ResponseEntity<SuccessRes> duplicateEmail(@PathVariable("email") String email) throws DuplicateException {

        log.debug("중복체크 요청 이메일 = {}", email);

        userService.duplicateEmail(email);

        HttpStatus httpStatus = HttpStatus.OK;
        SuccessRes successRes = SuccessRes.builder().message(SUCCESS).build();

        return new ResponseEntity<>(successRes, httpStatus);

    }

    /**
     * 닉네임 중복체크
     *
     * @param nickname 중복체크 요청한 닉네임
     * @return 성공 시 성공메시지를 {@code ResponseEntity}로 반환합니다
     * @throws DuplicateException
     */
    @ApiOperation(value = "닉네임 중복체크")
    @GetMapping("/signup/nickname/{nickname}")
    public ResponseEntity<SuccessRes> duplicateNickname(@PathVariable("nickname") String nickname) throws DuplicateException {

        log.debug("중복체크 요청 닉네임 = {}", nickname);

        userService.duplicateNickname(nickname);

        HttpStatus httpStatus = HttpStatus.OK;
        SuccessRes successRes = SuccessRes.builder().message(SUCCESS).build();

        return new ResponseEntity<>(successRes, httpStatus);
    }

    /**
     * 회원 가입
     *
     * @param insertUserReq 회원 가입 form에 사용자가 입력한 정보
     * @return 성공 시 성공메시지를 {@code ResponseEntity}로 반환합니다
     * @throws DuplicateException
     */
    @ApiOperation(value = "회원가입")
    @PostMapping("/signup")
    public ResponseEntity<SuccessRes> insertUser(@Valid @RequestBody InsertUserReq insertUserReq) throws DuplicateException {

        log.debug("회원가입 정보 = {} ", insertUserReq.toString());

        userService.insertUser(insertUserReq);
        SuccessRes successRes = SuccessRes.builder().message(SUCCESS).build();

        return new ResponseEntity<>(successRes, HttpStatus.OK);
    }

    /**
     * 로그인
     *
     * @param loginReq 로그인을 요청한 사용자의 이메일, 비밀번호
     * @param httpServletRequest
     * @param httpServletResponse
     * @return 로그인 한 사용자의 정보 중 상시 화면에 노출되어야 하는 정보를 {@code ResponseEntity}로 반환합니다
     * @throws NotFoundException
     */
    @ApiOperation(value = "로그인")
    @PostMapping("/login")
    public ResponseEntity<LoginRes> loginUser(@RequestBody LoginReq loginReq, HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws NotFoundException {

        log.debug("로그인 요청 들어옴.");

        HttpStatus status = null;
        LoginRes loginRes = null;

        User loginUser = userService.loginUser(loginReq.getEmail(), loginReq.getPassword());

        Date now = new Date();

        AuthToken accessToken = tokenProvider.createAuthToken(
                loginUser.getId(),
                loginUser.getNickname(),
                "ROLE_USER",
                new Date(now.getTime() + appProperties.getAuth().getTokenExpiry())
        );


        long refreshTokenExpiry = appProperties.getAuth().getRefreshTokenExpiry();


        AuthToken refreshToken = tokenProvider.createAuthToken(
                appProperties.getAuth().getTokenSecret(),
                new Date(now.getTime() + refreshTokenExpiry)
        );

        log.debug("일반 로그인 user id(PK) : {}, 닉네임 : {}", loginUser.getId(), loginUser.getNickname());
        log.debug("일반 user 로그인 accessToken 정보 : {}", accessToken.getToken());
        log.debug("일반 user 로그인 refreshToken 정보 : {}", refreshToken.getToken());


        userService.saveRefreshToken(loginUser.getId(), refreshToken.getToken());

        loginRes = LoginRes.builder()
                .nickname(loginUser.getNickname())
                .picture(loginUser.getPicture())
                .level(loginUser.getLevel())
                .experience(loginUser.getExperience())
                .accessToken(accessToken.getToken())
                .message(SUCCESS)
                .build();


        int cookieMaxAge = (int) refreshTokenExpiry / 60;


        CookieUtil.deleteCookie(httpServletRequest, httpServletResponse, REFRESH_TOKEN);

        CookieUtil.addCookie(httpServletResponse, REFRESH_TOKEN, refreshToken.getToken(), cookieMaxAge);

        status = HttpStatus.OK;


        return new ResponseEntity<LoginRes>(loginRes, status);
    }

    /**
     * 로그아웃
     *
     * @param httpServletRequest
     * @param httpServletResponse
     * @return 성공 시 성공메시지를 {@code ResponseEntity}로 반환합니다
     * @throws NotFoundException
     */
    @ApiOperation(value = "로그아웃")
    @GetMapping("/logout")
    public ResponseEntity<SuccessRes> logoutUser(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws NotFoundException {

        User user = (User) httpServletRequest.getAttribute("user");

        HttpStatus status = HttpStatus.OK;

        userService.deleteRefreshToken(user.getId());
        CookieUtil.deleteCookie(httpServletRequest, httpServletResponse, REFRESH_TOKEN);
        SuccessRes successRes = SuccessRes.builder().message(SUCCESS).build();

        return new ResponseEntity<>(successRes, status);
    }

    /**
     * Access Token 재발급
     *
     * @param httpServletRequest
     * @return 재발급 된 access token을 {@code ResponseEntity}로 반환합니다
     * @throws UnAuthorizedException
     */
    @ApiOperation(value = "Access Token 재발급", notes = "만료된 access token을 재발급받는다.", response = Map.class)
    @GetMapping("/refresh")
    public ResponseEntity<RefreshTokenRes> refreshToken(HttpServletRequest httpServletRequest)
            throws UnAuthorizedException {
        User user = (User) httpServletRequest.getAttribute("user");


        String refreshToken = CookieUtil.getCookie(httpServletRequest, REFRESH_TOKEN)
                .map(Cookie::getValue)
                .orElse(null);

        log.debug("쿠키에 담긴 refresh token : {}", refreshToken);

        AuthToken authRefreshToken = tokenProvider.convertAuthToken(refreshToken);

        if (authRefreshToken.validate() == false || user.getRefreshToken() == null) {
            log.debug("유효하지 않은 refresh token 입니다.");
            throw new UnAuthorizedException("유효하지 않은 refresh token 입니다.");
        }

        Date now = new Date();


        AuthToken accessToken = tokenProvider.createAuthToken(
                user.getId(),
                user.getNickname(),
                "ROLE_USER",
                new Date(now.getTime() + appProperties.getAuth().getTokenExpiry())
        );

        log.debug("정상적으로 액세스토큰 재발급!!!");
        RefreshTokenRes refreshTokenRes = RefreshTokenRes.builder().message(SUCCESS).accessToken(accessToken.getToken()).build();
        HttpStatus status = HttpStatus.OK;


        return new ResponseEntity<RefreshTokenRes>(refreshTokenRes, status);
    }

    /**
     * 회원 정보 조회 - 일반, 카카오톡 사용자 모두 조회할 수 있도록 email, kakaoId 모두 반환해줍니다.
     *
     * @param httpServletRequest
     * @return 해당 메서드를 호출한 사용자의 정보를 {@code ResponseEntity}로 반환합니다
     */
    @ApiOperation(value = "회원 정보 조회")
    @GetMapping("/profile")
    public ResponseEntity<GetUserRes> getUser(HttpServletRequest httpServletRequest) {
        User user = (User) httpServletRequest.getAttribute("user");

        GetUserRes getUserRes = userService.getUser(user.getId());

        return new ResponseEntity<GetUserRes>(getUserRes, HttpStatus.OK);
    }

    /**
     * 프로필 수정
     *
     * @param updateUserReq 수정할 닉네임, 프로필 사진
     * @param httpServletRequest
     * @return 성공 시 성공메시지를 {@code ResponseEntity}로 반환합니다
     * @throws NotFoundException
     * @throws DuplicateException
     */
    @ApiOperation(value = "프로필 수정")
    @PutMapping("/profile")
    public ResponseEntity<SuccessRes> updateUser(@RequestBody UpdateUserReq updateUserReq, HttpServletRequest httpServletRequest) throws NotFoundException, DuplicateException {

        User user = (User) httpServletRequest.getAttribute("user");

        userService.updateUser(updateUserReq, user.getId());

        SuccessRes successRes = SuccessRes.builder().message(SUCCESS).build();

        return new ResponseEntity<>(successRes, HttpStatus.OK);

    }

    /**
     * 게임, 테스트 결과 경험치 반영
     *
     * @param experience 게임, 테스트에서 획득한 경험치
     * @param httpServletRequest
     * @return 획득한 경험치를 사용자 정보에 업데이트 한 레벨, 경험치를 {@code ResponseEntity}로 반환합니다
     */
    @ApiOperation(value = "게임, 테스트 결과 경험치 반영")
    @PutMapping("/game/{experience}")
    public ResponseEntity<UpdateExperienceRes> updateExperience(@PathVariable("experience") int experience, HttpServletRequest httpServletRequest) {
        User user = (User) httpServletRequest.getAttribute("user");

        UpdateExperienceRes updateExperienceRes = userService.updateExperience(user.getId(), experience);

        return new ResponseEntity<UpdateExperienceRes>(updateExperienceRes, HttpStatus.OK);

    }

    /**
     * 실시간 랭킹 조회
     *
     * @return 경험치를 기준으로 상위 10명의 리스트를 담은 {@code ResponseEntity}를 반환합니다
     * @throws NotFoundException
     */
    @ApiOperation(value = "실시간 랭킹 조회")
    @GetMapping("/ranking")
    public ResponseEntity<List<GetTopTenUserRes>> getTopTenUser() throws NotFoundException {
        return new ResponseEntity<List<GetTopTenUserRes>>(userService.getTopTenUser(), HttpStatus.OK);
    }

}
