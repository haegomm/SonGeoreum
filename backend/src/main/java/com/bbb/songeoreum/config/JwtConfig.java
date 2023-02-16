package com.bbb.songeoreum.config;

import com.bbb.songeoreum.db.repository.UserRepository;
import com.bbb.songeoreum.jwt.AuthTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class JwtConfig {

    private final UserRepository userRepository;

    @Value("${jwt.secret}")
    private String secret;

    @Bean
    public AuthTokenProvider jwtProvider() {
        return new AuthTokenProvider(secret, userRepository);
    }

}
