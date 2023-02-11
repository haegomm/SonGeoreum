package com.bbb.songeoreum.config;

import com.bbb.songeoreum.db.repository.OAuth2AuthorizationRequestBasedOnCookieRepository;
//import com.bbb.songeoreum.jwt.AuthTokenProvider;
import com.bbb.songeoreum.db.repository.UserRepository;
import com.bbb.songeoreum.exception.RestAuthenticationEntryPoint;
import com.bbb.songeoreum.jwt.AuthTokenProvider;
import com.bbb.songeoreum.jwt.filter.TokenAuthenticationFilter;
import com.bbb.songeoreum.oauth.handler.OAuth2AuthenticationSuccessHandler;
import com.bbb.songeoreum.oauth.handler.TokenAccessDeniedHandler;
import com.bbb.songeoreum.oauth.service.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CorsFilter corsFilter;
    private final CustomOAuth2UserService customOAuth2UserService;
    //    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
    private final AppProperties appProperties;
    private final AuthTokenProvider tokenProvider;
    private final UserRepository userRepository;

    private final TokenAccessDeniedHandler tokenAccessDeniedHandler;


    // Swagger는 spring security 적용에서 제외
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
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS) // jwt token으로 인증하므로 세션이 필요없음. 따라서 세션 생성안함
                .and()
                .csrf().disable() // rest api이므로 csrf 보안이 필요없으므로 disable처리
                .addFilter(corsFilter) // 백으로 오는 모든 요청은 CorsConfig에 정의 해 놓은 필터를 지나쳐감.
                .formLogin().disable() // jwt를 사용하므로 로그인 폼 필요하지 않음.
                .httpBasic().disable() // 기본 http 방식 안 씀.
                .authorizeRequests() // 다음 리퀘스트에 대한 사용 권한 체크
//                .antMatchers("/**").permitAll() // 테스트용으로 모든 접근 허용해줌.
                .antMatchers("/api/game/**", "/api/user/logout/**", "/api/user/refresh/**", "/api/user/profile/**", "/api/user/game/**", "/api/favorites/**").authenticated()
                .anyRequest().permitAll() // 그외 나머지 요청은 모두 접근 가능
                .and()
                .logout() // 로그아웃을 하면
                .logoutSuccessUrl("/") // 메인 페이지로 redirect 한다.
//                .invalidateHttpSession(true) // 로그아웃 이후 세션 전체 삭제하기, 필요성을 아직 잘 모르겠지만 나중에 필요할까봐 넣어둠.
//                .deleteCookies("JSESSIONID") // 로그아웃 이후 쿠키 삭제하기, 필요성을 아직 잘 모르겠지만 나중에 필요할까봐 넣어둠.
//                .clearAuthentication(true) // 로그아웃 이후 인증 초기화
//                .and()
//                .oauth2Login() // oauth2로그인 (소셜 로그인 설정을 시작하겠다.)
////                .authorizationEndpoint() //아래 uri로 접근시 oauth 로그인을 요청한다.
////                .baseUri("/oauth2/authorization") // https://i8b106.p.ssafy.io/api/oauth2/authorization/kakao 로그인 요청 보내는 주소
////                .authorizationRequestRepository(oAuth2AuthorizationRequestBasedOnCookieRepository()) // 인가요청을 시작한 시점부터 인가 요청을 받는(콜백) 시점까지 OAuth2AuthorizationRequest를 유지해줌.
////                .and()
//                .redirectionEndpoint() // 아래 uri로 접근시 redirect 된다.
//                .baseUri("/*/login/oauth2/code/*") // https://i8b106.p.ssafy.io/oauth2/code/kakao 프론트로 redirect 되는 주소
//                .and()
//                .userInfoEndpoint()
//                .userService(customOAuth2UserService)
//                .and()
//                .successHandler(oAuth2AuthenticationSuccessHandler())
////                .failureHandler(oAuth2AuthenticationFailureHandler())
                .and()
                .addFilterBefore(tokenAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class) // OAuth2를 이용한 인증이 아닌 username, password를 쓰는 form 기반 인증을 처리하는 필터로 자세한 내용은 노션 지식 공유 참고
                .exceptionHandling()
                .authenticationEntryPoint(new RestAuthenticationEntryPoint()) // 인증 실패 시 처리
                .accessDeniedHandler(tokenAccessDeniedHandler) // 인가 실패 시 처리
                .and()
//                .and().build();
                .build();
    }

    // password 인코딩 해줌.
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 쿠키 기반 인가 Repository
    // 인가 응답을 연계하고 검증할 때 사용
    @Bean
    public OAuth2AuthorizationRequestBasedOnCookieRepository oAuth2AuthorizationRequestBasedOnCookieRepository() {
        return new OAuth2AuthorizationRequestBasedOnCookieRepository();
    }


    // OAUTH 인증 성공 핸들러
    @Bean
    public OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler() {
        return new OAuth2AuthenticationSuccessHandler(
                userRepository,
                tokenProvider,
                appProperties,
                oAuth2AuthorizationRequestBasedOnCookieRepository()
        );
    }

    // 토큰 필터 설정
    @Bean
    public TokenAuthenticationFilter tokenAuthenticationFilter() {
        return new TokenAuthenticationFilter(tokenProvider);
    }

}
