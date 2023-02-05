package com.bbb.songeoreum.oauth.handler;

import com.bbb.songeoreum.config.AppProperties;
import com.bbb.songeoreum.db.domain.User;
import com.bbb.songeoreum.db.repository.OAuth2AuthorizationRequestBasedOnCookieRepository;
import com.bbb.songeoreum.db.repository.UserRepository;
import com.bbb.songeoreum.jwt.AuthToken;
import com.bbb.songeoreum.jwt.AuthTokenProvider;
import com.bbb.songeoreum.oauth.entity.ProviderType;
import com.bbb.songeoreum.oauth.entity.RoleType;
import com.bbb.songeoreum.oauth.info.OAuth2UserInfo;
import com.bbb.songeoreum.oauth.info.OAuth2UserInfoFactory;
import com.bbb.songeoreum.util.CookieUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import java.time.LocalDateTime;
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
    //    private final UserRefreshTokenRepository userRefreshTokenRepository;
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

        String targetUrl = redirectUri.orElse(getDefaultTargetUrl());
        log.debug("determineTargetUrl method targetUrl : {}", targetUrl);

        // OAuth(소셜로그인)로 인증된 사용자는 OAuth2AuthenticationToken 유형이다.
        OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) authentication;
        log.debug("authToken : {}", authToken);
        ProviderType providerType = ProviderType.valueOf(authToken.getAuthorizedClientRegistrationId().toUpperCase());

        // Authentication 객체 안에는 UserDetails 타입(일반사용자)과 OAuth2User 타입(카카오사용자)만 저장할 수 있다.
        OidcUser oidcUser = ((OidcUser) authentication.getPrincipal()); // 현재 Authentication 객체에 들어있는 사용자 객체를 반환
        OAuth2UserInfo userInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(providerType, oidcUser.getAttributes());
        Collection<? extends GrantedAuthority> authorities = ((OidcUser) authentication.getPrincipal()).getAuthorities();

        // 토큰 저장 시작
        RoleType roleType = hasAuthority(authorities, RoleType.ADMIN.getCode()) ? RoleType.ADMIN : RoleType.USER;

        Date now = new Date();

        User user = userRepository.findByKakaoId(userInfo.getProviderId());
        log.debug("determineTargetUrl 메서드에서 user 조회 결과 : {}", user);

        Long id = 0L; // user 테이블의 pk 저장해줄 변수
        if (user == null) {
            id = userRepository.count() + 1;
        } else {
            id = user.getId();
        }

        // access 토큰 설정
        AuthToken accessToken = tokenProvider.createAuthToken(
                id, // access 토큰에 user pk 저장
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

        // DB 저장
//        User userRefreshToken = userRepository.findByKakaoId(userInfo.getProviderId());
        // 카카오 아이디로 조회 결과 가입한 적 있는 경우
        if (user != null) {
            user.saveRefreshToken(refreshToken.getToken());
        }
        // 카카오 아이디로 조회 결과 가입한 적 없는 경우
        else {
            LocalDateTime createdDate = LocalDateTime.now();
            String nickname = "guest" + (userRepository.count() + 1);
            user = new User(providerType.toString(), userInfo.getEmail(), userInfo.getProviderId(), nickname, refreshToken.getToken(), createdDate);
            userRepository.saveAndFlush(user); // save() 메서드와 달리 실행중(트랜잭션)에 즉시 data를 flush 함.
        }

        int cookieMaxAge = (int) refreshTokenExpiry / 60;

        CookieUtil.deleteCookie(request, response, REFRESH_TOKEN);
        CookieUtil.addCookie(response, REFRESH_TOKEN, refreshToken.getToken(), cookieMaxAge);

        return UriComponentsBuilder.fromUriString(targetUrl)
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