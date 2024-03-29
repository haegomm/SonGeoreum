package com.bbb.songeoreum.jwt;

import com.bbb.songeoreum.db.repository.UserRepository;
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
public class AuthToken {

    @Getter
    private final String token;
    private final Key key;
    private static final String AUTHORITIES_KEY = "role";

    private final UserRepository userRepository;


    public AuthToken(String id, Date expiry, Key key, UserRepository userRepository) {
        this.userRepository = userRepository;
        this.key = key;
        this.token = createAuthToken(id, expiry);
    }


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
    private String createAuthToken(String id, Date expiry) {
        return Jwts.builder()
                .setHeaderParam("type", "JWT")
                .setHeaderParam("createdDate", System.currentTimeMillis())
                .setSubject("refreshToken")
                .signWith(key, SignatureAlgorithm.HS256)
                .setExpiration(expiry)
                .compact();
    }

    private String createAuthToken(Long id, String nickname, String role, Date expiry) {
        return Jwts.builder()
                .setHeaderParam("type", "JWT")
                .setSubject("accessToken")
                .claim(AUTHORITIES_KEY, role)
                .claim("id", id)
                .claim("nickname", nickname)
                .signWith(key, SignatureAlgorithm.HS256)
                .setExpiration(expiry)
                .compact();
    }

    public boolean validate() {
        log.debug("validate() 호출됨.");
        return this.getTokenClaims() != null;
    }

    public Claims getTokenClaims() {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (SecurityException e) {
            log.info("Invalid JWT signature.");
        } catch (MalformedJwtException e) {
            log.info("Invalid JWT token.");
        } catch (ExpiredJwtException e) {
            log.info("Expired JWT token.");
        } catch (UnsupportedJwtException e) {
            log.info("Unsupported JWT token.");
        } catch (IllegalArgumentException e) {
            log.info("JWT token compact of handler are invalid.");
            log.debug(e.getMessage());
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