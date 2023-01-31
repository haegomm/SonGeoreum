package com.bbb.pjtname.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public WebSecurityCustomizer configure() {
        return (web) -> web.ignoring().mvcMatchers(
                "/v3/api-docs/**",
                "/swagger-ui/**",
                "/swagger-resources/**",
                "/swagger/**",
                "/webjars/**'",
                "/api/v1/login" // 임시
        );
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf().disable() // rest api이므로 csrf 보안이 필요없으므로 disable처리
                .httpBasic() //.disable() // rest api 이므로 기본설정 사용안함. 기본설정은 비인증시 로그인폼 화면으로 리다이렉트 된다.
//                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS) // jwt token으로 인증하므로 세션이 필요없음. 따라서 세션 생성안함
                .and()
                .authorizeRequests() // 다음 리퀘스트에 대한 사용 권한 체크
                .antMatchers("/user/signup").permitAll() // 가입은 누구나 접근 가능
                .anyRequest().authenticated() // 그외 나머지 요청은 모두 인증된 회원만 접근 가능
                .and().build();
    }
}
