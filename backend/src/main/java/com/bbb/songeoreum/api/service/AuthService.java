package com.bbb.songeoreum.api.service;


import com.bbb.songeoreum.api.response.KakaoLoginRes;
import com.bbb.songeoreum.config.AppProperties;
import com.bbb.songeoreum.db.domain.User;
import com.bbb.songeoreum.db.repository.UserRepository;
import com.bbb.songeoreum.exception.NotFoundException;
import com.bbb.songeoreum.jwt.AuthToken;
import com.bbb.songeoreum.jwt.AuthTokenProvider;
import com.bbb.songeoreum.util.CookieUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.Date;

import static com.bbb.songeoreum.db.repository.OAuth2AuthorizationRequestBasedOnCookieRepository.REFRESH_TOKEN;

/**
 * {@code AuthService}는 카카오 사용자 관련 로직을 처리하는 서비스입니다.
 *
 * @author wjdwn03
 * @version 1.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";

    @Value("${SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_KAKAO_CLIENTID}")
//    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String KAKAO_CLIENT_ID;

    @Value("${SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_KAKAO_CLIENTSECRET}")
//    @Value("${spring.security.oauth2.client.registration.kakao.client-secret}")
    private String KAKAO_CLIENT_SECRET;

    @Value("${SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_KAKAO_REDIRECTURI}")
//    @Value("${spring.security.oauth2.client.registration.kakao.redirect-uri}")
    private String KAKAO_REDIRECT_URI;

    @Value("${spring.security.oauth2.client.provider.kakao.token-uri}")
    private String KAKAO_TOKEN_URI;

    @Value("${spring.security.oauth2.client.provider.kakao.user-info-uri}")
    private String KAKO_USER_INFO_URI;


    private final UserRepository userRepository;
    private final AuthTokenProvider tokenProvider;
    private final AppProperties appProperties;

    /**
     * 인가코드로 카카오에게 access token을 요청하여 전달받은 반환합니다.
     *
     * @param code 전달받은 인가코드
     * @return 카카오가 발급한 access token
     */
    public String getKakaoAccessToken(String code) {

        String kakaoAccessToken = "";
        try {
            URL url = new URL(KAKAO_TOKEN_URI);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);

            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
            StringBuilder sb = new StringBuilder();
            sb.append("grant_type=authorization_code");
            sb.append("&client_id=" + KAKAO_CLIENT_ID);
            sb.append("&client_secret=" + KAKAO_CLIENT_SECRET);
            sb.append("&redirect_uri=" + KAKAO_REDIRECT_URI);
            sb.append("&code=" + code);

            bw.write(sb.toString());
            bw.flush();

            int responseCode = conn.getResponseCode();
            log.debug("response code : {}  ", responseCode);

            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));

            String line = "";
            String kakaoResponse = "";

            while ((line = br.readLine()) != null) {
                kakaoResponse += line;
            }
            log.debug("response body : {}", kakaoResponse);
            JSONParser parser = new JSONParser();
            JSONObject jsonObject = (JSONObject) parser.parse(kakaoResponse);

            kakaoAccessToken = (String) jsonObject.get("access_token");

            br.close();
            bw.close();
        } catch (Exception e) {
            log.error(e.getMessage());
        }

        return kakaoAccessToken;
    }

    /**
     * DB에 저장된 카카오 사용자 정보로 로그인 처리합니다.
     * access token, refresh token을 발급하고 refresh token은 쿠키에 저장합니다.
     * saveAndFlush는 save() 메서드와 달리 실행중(트랜잭션)에 즉시 data를 flush 한다.
     *
     * @param kakaoAccessToken 카카오가 발급한 access token
     * @param request
     * @param response
     * @return 카카오 사용자 정보를 DB에 저장한 정보 중 화면에 상시 노출되어야 하는 정보를 {@code ResponseEntity}로 반환합니다.
     * @throws NotFoundException
     */
    @Transactional
    public ResponseEntity<KakaoLoginRes> kakaoLogin(String kakaoAccessToken, HttpServletRequest request, HttpServletResponse response) throws NotFoundException {

        HttpStatus status = null;
        KakaoLoginRes kakaoLoginRes = null;

        try {
            User kakaoUser = getKakaoInfo(kakaoAccessToken);

            if (kakaoUser == null) {
                throw new NotFoundException("카카오로부터 user 정보를 가져오지 못했습니다.");
            }

            Date now = new Date();

            AuthToken accessToken = tokenProvider.createAuthToken(
                    kakaoUser.getId(),
                    kakaoUser.getNickname(),
                    "ROLE_USER",
                    new Date(now.getTime() + appProperties.getAuth().getTokenExpiry())
            );

            long refreshTokenExpiry = appProperties.getAuth().getRefreshTokenExpiry();

            AuthToken refreshToken = tokenProvider.createAuthToken(
                    appProperties.getAuth().getTokenSecret(),
                    new Date(now.getTime() + refreshTokenExpiry)
            );

            log.debug("accessToken : {}", accessToken.getToken());
            log.debug("refreshToken : {}", refreshToken.getToken());

            kakaoUser.saveRefreshToken(refreshToken.getToken());
            log.debug("kakaoUser 리프레시 토큰 저장한 후 : {}", kakaoUser.getRefreshToken());
            userRepository.saveAndFlush(kakaoUser);

            kakaoLoginRes = KakaoLoginRes.builder()
                    .nickname(kakaoUser.getNickname())
                    .picture(kakaoUser.getPicture())
                    .level(kakaoUser.getLevel())
                    .experience(kakaoUser.getExperience())
                    .accessToken(accessToken.getToken())
                    .message(SUCCESS)
                    .build();

            int cookieMaxAge = (int) refreshTokenExpiry / 60;

            CookieUtil.deleteCookie(request, response, REFRESH_TOKEN);
            CookieUtil.addCookie(response, REFRESH_TOKEN, refreshToken.getToken(), cookieMaxAge);
            status = HttpStatus.ACCEPTED;

        } catch (IllegalArgumentException e) {
            log.error("로그인 실패 : {}", e.getMessage());
            throw new IllegalArgumentException("카카오로부터 user 정보를 가져오지 못했습니다.");
        }

        return new ResponseEntity<KakaoLoginRes>(kakaoLoginRes, status);

    }

    /**
     * 카카오가 발급한 access token으로 카카오 사용자 정보를 요청하여 반환합니다.
     * 카카오 사용자는 최초 로그인 시 닉네임이 guest + 숫자로 지정됩니다.
     *
     * @param kakaoAccessToken 카카오가 발급한 access token
     * @return 카카오가 보낸 사용자 정보를 DB에 저장한 후 User 객체로 반환합니다.
     */
    public User getKakaoInfo(String kakaoAccessToken) {
        User user = null;

        try {
            URL url = new URL(KAKO_USER_INFO_URI);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Authorization", "Bearer " + kakaoAccessToken);
            int responseCode = conn.getResponseCode();
            log.debug("responseCode : {} ", responseCode);

            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));

            String line = "";
            String kakaoResponse = "";

            while ((line = br.readLine()) != null) {
                kakaoResponse += line;
            }

            log.debug("response body : {} ", kakaoResponse);

            JSONParser parser = new JSONParser();
            JSONObject jsonObject = (JSONObject) parser.parse(kakaoResponse);

            String kakaoId = jsonObject.get("id").toString();
            log.debug("카카오가 넘겨준 카카오 id : {} ", kakaoId);

            user = userRepository.findByKakaoId(kakaoId);

            if (user != null) {
                log.debug("카카오로 로그인을 한 적이 있는 user입니다.");
            } else {
                log.debug("카카오 로그인 최초입니다.");

                String nickname = "guest" + (userRepository.count() + 1);
                LocalDateTime createdDate = LocalDateTime.now();

                user = new User("KAKAO", kakaoId, nickname, createdDate);

                return userRepository.saveAndFlush(user);
            }
        } catch (Exception e) {
            log.debug(e.getMessage());
        }
        return user;
    }
}
