package com.bbb.songeoreum.jwt;

import com.bbb.songeoreum.db.repository.UserRepository;
import com.bbb.songeoreum.exception.TokenValidFailedException;
import com.bbb.songeoreum.oauth.entity.PrincipalDetails;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.security.Key;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
public class AuthTokenProvider {
    private final Key key;
    private static final String AUTHORITIES_KEY = "role";

    // 보통 private final을 붙여야 하는데 이건 왜 final을 지워야 에러가 안 나는건지 이해가 안 됨.
    private final UserRepository userRepository;

    /**
     * 객체 초기화
     *
     * @param secret         : jwt의 secret
     * @param userRepository
     */
    public AuthTokenProvider(String secret, UserRepository userRepository) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.userRepository = userRepository;
    }

    /*
    jwt refresh 토큰 생성
     */
    public AuthToken createAuthToken(String id, Date expiry) {
        return new AuthToken(id, expiry, key, userRepository);
    }

    /*
    jwt access 토큰 생성
     */
    public AuthToken createAuthToken(Long id, String nickname, String role, Date expiry) {
        return new AuthToken(id, nickname, role, expiry, key, userRepository);
    }

    public AuthToken convertAuthToken(String token) {
        return new AuthToken(token, key, userRepository);
    }

    public Authentication getAuthentication(AuthToken authToken) {

        log.debug("getAuthentication 메서드로 들어왔당");
//         토큰 검증
        if (authToken.validate()) {

            // claims 가져오기
            Claims claims = authToken.getTokenClaims();
            Collection<? extends GrantedAuthority> authorities =
                    // claims 중에 role 꺼내서 가져오기 == 권한 가져오기
                    Arrays.stream(new String[]{claims.get(AUTHORITIES_KEY).toString()})
                            .map(SimpleGrantedAuthority::new)
                            .collect(Collectors.toList());

            log.debug("claims subject := [{}]", claims.getSubject()); // accessToken 이라는 문자열 반환
            // 시큐리티 인증 객체 가져오기
            // claims.get("id") => return type : Object
            // 따라서 Long 타입으로 바꿔주기 위해 String으로 변환한 후 Long으로 타입 변환함.
            PrincipalDetails principalDetails = new PrincipalDetails(userRepository.findById(Long.valueOf(String.valueOf(claims.get("id")))).get());
            return new UsernamePasswordAuthenticationToken(principalDetails, authToken, authorities);
        } else {
            throw new TokenValidFailedException();
        }
    }

}