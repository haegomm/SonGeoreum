package com.bbb.songeoreum.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.SignatureAlgorithm;
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

    // refresh token
    public AuthToken(String id, Date expiry, Key key) {
        this.key = key;
        this.token = createAuthToken(id, expiry);
    }

    // access token
    public AuthToken(String id, String role, Date expiry, Key key) {
        this.key = key;
        this.token = createAuthToken(id, role, expiry);
    }

    // jwt refresh token 생성
    private String createAuthToken(String id, Date expiry) {
        return Jwts.builder()
                .setSubject(id)
                .signWith(SignatureAlgorithm.HS256, key)
                .setExpiration(expiry)
                .compact();
    }

    // jwt access token 생성
    private String createAuthToken(String id, String role, Date expiry) {
        return Jwts.builder()
                .setSubject(id)
                .claim(AUTHORITIES_KEY, role)
                .signWith(SignatureAlgorithm.HS256, key)
                .setExpiration(expiry)
                .compact();
    }

//    public boolean validate() {
//        log.debug("validate");
//        return this.getTokenClaims() != null;
//    }

    /*
    토큰 뜯어보기
     */
//    public Claims getTokenClaims() {
//        log.debug("getTokenClaims");
//        log.debug("key = {}", key);
//        try {
//            return Jwts.parserBuilder()
//                    .setSigningKey(key)
//                    .build()
//                    .parseClaimsJws(token)
//                    .getBody();
//        } catch (SecurityException e) {
//            log.info("Invalid JWT signature.");
//        } //catch (MalformedJwtException e) {
////            log.info("Invalid JWT token.");
////        } catch (ExpiredJwtException e) {
////            log.info("Expired JWT token.");
////        } catch (UnsupportedJwtException e) {
////            log.info("Unsupported JWT token.");
////        } catch (IllegalArgumentException e) {
////            log.info("JWT token compact of handler are invalid.");
////            log.debug(e.getMessage());
////        }
//        return null;
//    }
//
//    public Claims getExpiredTokenClaims() {
//        try {
//            parserBuilder()
//                    .setSigningKey(key)
//                    .build()
//                    .parseClaimsJws(token)
//                    .getBody();
//        } catch (ExpiredJwtException e) {
////            log.info("Expired JWT token");
////            return e.getClaims();
////        }
//            return null;
//        }
//    }
}