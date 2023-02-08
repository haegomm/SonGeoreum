package com.bbb.songeoreum.oauth.handler;

import com.bbb.songeoreum.config.AppProperties;
import com.bbb.songeoreum.db.domain.User;
import com.bbb.songeoreum.db.repository.OAuth2AuthorizationRequestBasedOnCookieRepository;
import com.bbb.songeoreum.db.repository.UserRepository;
import com.bbb.songeoreum.jwt.AuthToken;
import com.bbb.songeoreum.jwt.AuthTokenProvider;
import com.bbb.songeoreum.oauth.entity.PrincipalDetails;
import com.bbb.songeoreum.oauth.entity.RoleType;
import com.bbb.songeoreum.util.CookieUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import java.util.Collection;
import java.util.Date;
import java.util.Optional;

import static com.bbb.songeoreum.db.repository.OAuth2AuthorizationRequestBasedOnCookieRepository.REDIRECT_URI_PARAM_COOKIE_NAME;
import static com.bbb.songeoreum.db.repository.OAuth2AuthorizationRequestBasedOnCookieRepository.REFRESH_TOKEN;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final AuthTokenProvider tokenProvider;
    private final AppProperties appProperties;
    private final OAuth2AuthorizationRequestBasedOnCookieRepository authorizationRequestRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        log.debug("CustomOAuth2UserService에서 db에 카카오 user 정보 저장하고 success handler로 들어왔다!!!!!");
        String targetUrl = determineTargetUrl(request, response, authentication);
        log.debug("targetUrl : {}", targetUrl);

        // response commit 여부
        if (response.isCommitted()) {
            log.debug("Response has already been committed. Unable to redirect to " + targetUrl);
            return;
        }

        clearAuthenticationAttributes(request, response);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        Optional<String> redirectUri = CookieUtil.getCookie(request, REDIRECT_URI_PARAM_COOKIE_NAME)
                .map(Cookie::getValue);

        if (redirectUri.isPresent() && !isAuthorizedRedirectUri(redirectUri.get())) {
            throw new IllegalArgumentException("비인가 Redirect URI를 받아 인증을 진행할 수 없습니다!");
        }

        String targetUrl = redirectUri.orElse(getDefaultTargetUrl()); // "/" 가 들어가 있음.
        log.debug("determineTargetUrl method targetUrl : {}", targetUrl);

        log.debug("authentication.getPrincipal() : {}", authentication.getPrincipal().toString());
        // Authentication 객체 안에는 UserDetails 타입(일반사용자)과 OAuth2User 타입(카카오사용자)만 저장할 수 있다.
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal(); // 현재 Authentication 객체에 들어있는 사용자 객체를 반환
        log.debug("principalDetails : {}", principalDetails);
        User user = principalDetails.getUser(); // 카카오톡 사용자 정보 가져옴.
        log.debug("userInfo : {}", user);
        Collection<? extends GrantedAuthority> authorities = ((PrincipalDetails) authentication.getPrincipal()).getAuthorities();

        // 토큰 저장 시작
        RoleType roleType = hasAuthority(authorities, RoleType.ADMIN.getCode()) ? RoleType.ADMIN : RoleType.USER;

        Date now = new Date();


        // access 토큰 설정
        AuthToken accessToken = tokenProvider.createAuthToken(
                user.getId(), // access 토큰에 user pk 저장
                user.getNickname(),
                roleType.getCode(),
                new Date(now.getTime() + appProperties.getAuth().getTokenExpiry())
        );

        // refreshToken 기한
        long refreshTokenExpiry = appProperties.getAuth().getRefreshTokenExpiry();

        // refresh 토큰 설정
        AuthToken refreshToken = tokenProvider.createAuthToken(
                appProperties.getAuth().getTokenSecret(),
                new Date(now.getTime() + refreshTokenExpiry)
        );

        log.debug("accessToken : {}", accessToken.getToken());
        log.debug("refreshToken : {}", refreshToken.getToken());

        // DB 저장
        user.saveRefreshToken(refreshToken.getToken());
        log.debug("userInfo 리프레시 토큰 저장한 후 : {}", user.getRefreshToken());
        userRepository.saveAndFlush(user); // save() 메서드와 달리 실행중(트랜잭션)에 즉시 data를 flush 함.

        int cookieMaxAge = (int) refreshTokenExpiry / 60;

        CookieUtil.deleteCookie(request, response, REFRESH_TOKEN);
        CookieUtil.addCookie(response, REFRESH_TOKEN, refreshToken.getToken(), cookieMaxAge);

//        response.addHeader("accessToken", accessToken.getToken());

        return UriComponentsBuilder.fromUriString(targetUrl + "oauth2/code/kakao")
                .queryParam("token", accessToken.getToken())
                .build().toUriString();
    }

    protected void clearAuthenticationAttributes(HttpServletRequest request, HttpServletResponse response) {
        super.clearAuthenticationAttributes(request);
        authorizationRequestRepository.removeAuthorizationRequestCookies(request, response);
    }

    private boolean hasAuthority(Collection<? extends GrantedAuthority> authorities, String authority) {
        if (authorities == null) {
            return false;
        }

        for (GrantedAuthority grantedAuthority : authorities) {
            if (authority.equals(grantedAuthority.getAuthority())) {
                return true;
            }
        }
        return false;
    }

    private boolean isAuthorizedRedirectUri(String uri) {
        URI clientRedirectUri = URI.create(uri);

        return appProperties.getOauth2().getAuthorizedRedirectUris()
                .stream()
                .anyMatch(authorizedRedirectUri -> {
                    // Only validate host and port. Let the clients use different paths if they want to
                    URI authorizedURI = URI.create(authorizedRedirectUri);
                    if (authorizedURI.getHost().equalsIgnoreCase(clientRedirectUri.getHost())
                            && authorizedURI.getPort() == clientRedirectUri.getPort()) {
                        return true;
                    }
                    return false;
                });
    }
}