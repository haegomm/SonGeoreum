package com.bbb.songeoreum.jwt;

import com.bbb.songeoreum.db.repository.UserRepository;
import com.bbb.songeoreum.exception.NotFoundException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.SecurityException;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.security.Key;
import java.util.Date;

@Slf4j
@RequiredArgsConstructor
public class AuthToken { // JwtUtil

    @Getter
    private final String token;
    private final Key key;
    private static final String AUTHORITIES_KEY = "role";

    private final UserRepository userRepository;

    // refresh token
    public AuthToken(String id, Date expiry, Key key, UserRepository userRepository) {
        this.userRepository = userRepository;
        this.key = key;
        this.token = createAuthToken(id, expiry);
    }

    // access token
    public AuthToken(Long id, String nickname, String role, Date expiry, Key key, UserRepository userRepository) {
        this.userRepository = userRepository;
        this.key = key;
        this.token = createAuthToken(id, nickname, role, expiry);
    }

    /**
     * key : Claim에 셋팅될 key 값
     * data : Claim에 셋팅 될 data 값
     * subject : payload에 sub의 value로 들어갈 subject값
     * expire : 토큰 유효기간 설정을 위한 값
     * jwt 토큰의 구성 : header+payload+signature
     */
    // jwt refresh token 생성
    private String createAuthToken(String id, Date expiry) {
        return Jwts.builder()
                // Header 설정 : 토큰의 타입, 해쉬 알고리즘 정보 세팅.
                .setHeaderParam("type", "JWT")
                .setHeaderParam("createdDate", System.currentTimeMillis()) // 생성 시간
                // Payload 설정 : 유효기간(Expiration), 토큰 제목 (Subject), 데이터 (Claim) 등 정보 세팅.
                .setSubject("refreshToken") // 토큰 제목 설정 ex) accessToken, refreshToken
//                .claim("id", id) // user table PK
                // Signature 설정 : secret key를 활용한 암호화.
                .signWith(key, SignatureAlgorithm.HS256)
                .setExpiration(expiry)
                .compact();
    }

    // jwt access token 생성
    private String createAuthToken(Long id, String nickname, String role, Date expiry) {
        return Jwts.builder()
                // Header 설정 : 토큰의 타입, 해쉬 알고리즘 정보 세팅.
                .setHeaderParam("type", "JWT")
                .setHeaderParam("createdDate", System.currentTimeMillis()) // 생성 시간
                // Payload 설정 : 유효기간(Expiration), 토큰 제목 (Subject), 데이터 (Claim) 등 정보 세팅.
                .setSubject("accessToken")
                .claim(AUTHORITIES_KEY, role)
                .claim("id", id) // user table PK
                .claim("nickname", nickname)
                // Signature 설정 : secret key를 활용한 암호화.
                .signWith(key, SignatureAlgorithm.HS256)
                .setExpiration(expiry)
                .compact();
    }

    public boolean validate() throws java.lang.SecurityException, IllegalArgumentException, MalformedJwtException {
        log.debug("validate() 호출됨.");
        return this.getTokenClaims() != null;
    }

    /*
    토큰 뜯어보기
     */
    public Claims getTokenClaims() throws java.lang.SecurityException, IllegalArgumentException, MalformedJwtException {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (SecurityException e) {
            log.info("Invalid JWT signature.");
            throw new SecurityException("유효하지 않은 토큰입니다.");
        } catch (MalformedJwtException e) {
            log.info("Invalid JWT token.");
            throw new MalformedJwtException("유효하지 않은 토큰입니다.");
        } catch (ExpiredJwtException e) {
            log.info("Expired JWT token.");
        } catch (UnsupportedJwtException e) {
            log.info("Unsupported JWT token.");
        } catch (IllegalArgumentException e) {
            log.info("JWT token compact of handler are invalid.");
            log.debug(e.getMessage());
            throw new IllegalArgumentException("유효하지 않은 토큰입니다.");
        }
        return null;
    }

    public Claims getExpiredTokenClaims() {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            log.info("Expired JWT token");
            return e.getClaims();
        }
        return null;

    }
}