package com.bbb.songeoreum.jwt.filter;

import com.bbb.songeoreum.jwt.AuthToken;
import com.bbb.songeoreum.jwt.AuthTokenProvider;
import com.bbb.songeoreum.oauth.entity.PrincipalDetails;
import com.bbb.songeoreum.util.HeaderUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class TokenAuthenticationFilter extends OncePerRequestFilter {

    private final AuthTokenProvider tokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String headerToken = HeaderUtil.getAccessToken(request);
        log.debug("헤더야 : {}", request.getAttribute("accessToken"));
        log.debug("헤더로 넘어온 토큰 : {}", headerToken);
        AuthToken token = tokenProvider.convertAuthToken(headerToken);

        if (token.validate()) {
            log.debug("헤더로 넘어온 토큰이 null이 아니네!!!!");
            // Authentication이란 사용자의 아이디, 비번이 일치하는지 확인하는 과정인데 타입도 되는 것 같음.

            // 사용자가 입력한 아이디, 비번 인증이 성공하여 Authentication를 반환함.
            Authentication authentication = tokenProvider.getAuthentication(token);

            PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
            request.setAttribute("user", principalDetails.getUser());
            
            log.debug("request.getAttributes : {}", request.getAttribute("user"));

            // SecurityContextHolder 에다가 Authentication을 담아줌. 즉, 이 사용자는 인증이 완료되었다는 의미
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        filterChain.doFilter(request, response);
    }
}
