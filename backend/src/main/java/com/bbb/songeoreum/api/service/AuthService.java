package com.bbb.songeoreum.api.service;

import com.bbb.songeoreum.oauth.info.KakaoTokenDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

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
        }catch (Exception e){
            log.error(e.getMessage());
        }

        return kakaoAccessToken;
    }


}
