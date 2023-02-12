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


    // 인가코드로 kakaoAccessToken 받아오는 메소드
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
            Object obj = parser.parse(kakaoResponse); // JSON으로 파싱
            JSONObject jsonObject = (JSONObject) obj; // 파싱한 obj를 JSONObject 객체에 담음.

            kakaoAccessToken = (String) jsonObject.get("access_token");

            br.close();
            bw.close();
        } catch (Exception e) {
            log.error(e.getMessage());
        }

        return kakaoAccessToken;
    }

    // login 요청 보내는 회원가입 유무 판단해 분기 처리
    @Transactional
    public ResponseEntity<KakaoLoginRes> kakaoLogin(String kakaoAccessToken, HttpServletRequest request, HttpServletResponse response) throws NotFoundException {

        HttpStatus status = null;
        KakaoLoginRes kakaoLoginRes = null;
        // kakaoAccessToken 으로 회원정보 받아오기

        try {
            User kakaoUser = getKakaoInfo(kakaoAccessToken);

            if (kakaoUser == null) {
                throw new NotFoundException("카카오로부터 user 정보를 가져오지 못했습니다.");
            }

            // 토큰 저장 시작

            Date now = new Date();

            // access 토큰 설정
            AuthToken accessToken = tokenProvider.createAuthToken(
                    kakaoUser.getId(), // access 토큰에 user pk 저장
                    kakaoUser.getNickname(),
                    "ROLE_USER",
                    new Date(now.getTime() + appProperties.getAuth().getTokenExpiry())
            );

            // refreshToken 기한
            long refreshTokenExpiry = appProperties.getAuth().getRefreshTokenExpiry();

            // refresh 토큰 설정
            AuthToken refreshToken = tokenProvider.createAuthToken(
                    appProperties.getAuth().getTokenSecret(),
                    new Date(now.getTime() + refreshTokenExpiry)
            );

            log.debug("accessToken : {}", accessToken.getToken());
            log.debug("refreshToken : {}", refreshToken.getToken());

            // DB 저장
            kakaoUser.saveRefreshToken(refreshToken.getToken());
            log.debug("kakaoUser 리프레시 토큰 저장한 후 : {}", kakaoUser.getRefreshToken());
            userRepository.saveAndFlush(kakaoUser); // save() 메서드와 달리 실행중(트랜잭션)에 즉시 data를 flush 함.

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

    // kakaoAccessToken 으로 카카오 서버에 정보 요청
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
            Object obj = parser.parse(kakaoResponse); // JSON으로 파싱
            JSONObject jsonObject = (JSONObject) obj; // 파싱한 obj를 JSONObject 객체에 담음.

            String kakaoId = jsonObject.get("id").toString();
            log.debug("카카오가 넘겨준 카카오 id : {} ", kakaoId);

            user = userRepository.findByKakaoId(kakaoId);

            if (user != null) {
                log.debug("카카오로 로그인을 한 적이 있는 user입니다.");
            } else {
                log.debug("카카오 로그인 최초입니다.");

                // 카카오 사용자는 최초 로그인 시 닉네임이 guest + 숫자로 지정
                String nickname = "guest" + (userRepository.count() + 1);
                LocalDateTime createdDate = LocalDateTime.now();

                user = new User("KAKAO", kakaoId, nickname, createdDate);

                return userRepository.saveAndFlush(user); // save() 메서드와 달리 실행중(트랜잭션)에 즉시 data를 flush 함.
            }
        } catch (Exception e) {
            log.debug(e.getMessage());
        }
        return user;
    }


}
