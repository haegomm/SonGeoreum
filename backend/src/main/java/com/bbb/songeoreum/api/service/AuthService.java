package com.bbb.songeoreum.api.service;


import com.bbb.songeoreum.db.domain.User;
import com.bbb.songeoreum.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.HashMap;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)  // 트랜잭션 안에서만 데이터 변경하게 설정
public class AuthService {

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String KAKAO_CLIENT_ID;

    @Value("${spring.security.oauth2.client.registration.kakao.client-secret}")
    private String KAKAO_CLIENT_SECRET;

    @Value("${spring.security.oauth2.client.registration.kakao.redirect-uri}")
    private String KAKAO_REDIRECT_URI;

    @Value("${spring.security.oauth2.client.provider.kakao.token-uri}")
    private String KAKAO_TOKEN_URI;

    @Value("${spring.security.oauth2.client.provider.kakao.user-info-uri}")
    private String KAKO_USER_INFO_URI;

    private final UserRepository userRepository;


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
    public void kakaoLogin(String kakaoAccessToken) {
        // kakaoAccessToken 으로 회원정보 받아오기
        User kakaoUser = getKakaoInfo(kakaoAccessToken);

//        KakaoLoginRes kakaoLoginRes = new KakaoLoginRes();
//        try {
//            TokenDto tokenDto = securityService.login(kakaoUser);
//            loginResponseDto.setUser(userRepository.findByUserId(kakaoUser.getUserId()));
//            loginResponseDto.setLoginSuccess(true);
//            HttpHeaders headers = setTokenHeaders(tokenDto);
//            return ResponseEntity.ok().headers(headers).body(loginResponseDto);
//        } catch (CUserIdLoginFailedException e) {
//            loginResponseDto.setUser(kakaoUser);
//            loginResponseDto.setLoginSuccess(false);
//            return ResponseEntity.ok(loginResponseDto);
//        }
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
