package com.bbb.songeoreum.jwt;

import com.bbb.songeoreum.db.repository.UserRepository;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;

import java.security.Key;
import java.util.Date;

@Slf4j
@RequiredArgsConstructor
public class AuthTokenProvider {
    private final Key key;
    private static final String AUTHORITIES_KEY = "role";


//    private final UserRepository userRepository;

    /**
     * 객체 초기화
     *
     * @param secrete: jwt의 secrete
     */
    public AuthTokenProvider(String secrete) {
        this.key = Keys.hmacShaKeyFor(secrete.getBytes());
    }

    /*
    jwt refresh 토큰 생성
     */
    public AuthToken createAuthToken(String id, Date expiry) {
        return new AuthToken(id, expiry, key);
    }

    /*
    jwt access 토큰 생성
     */
    public AuthToken createAuthToken(String id, String role, Date expiry) {
        return new AuthToken(id, role, expiry, key);
    }

    public AuthToken convertAuthToken(String token) {
        return new AuthToken(token, key);
    }

//    public Authentication getAuthentication(AuthToken authToken) {
        // 토큰 검증
//        if (authToken.validate()) {
//
//            // claims 가져오기
//            Claims claims = authToken.getTokenClaims();
//            Collection<? extends GrantedAuthority> authorities =
//                    // claims 중에 role 꺼내서 가져오기 == 권한 가져오기
//                    Arrays.stream(new String[]{claims.get(AUTHORITIES_KEY).toString()})
//                            .map(SimpleGrantedAuthority::new)
//                            .collect(Collectors.toList());
//
//            log.debug("claims subject := [{}]", claims.getSubject()); // 이메일 반환
//            // 시큐리티 인증 객체 가져오기
//            PrincipalDetails principalDetails = new PrincipalDetails(userRepository.findByEmail(claims.getSubject()).get());
//            return new UsernamePasswordAuthenticationToken(principalDetails, authToken, authorities);
//        } else {
//            throw new TokenValidFailedException();
//        }
//    }

}