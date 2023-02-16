package com.bbb.songeoreum.oauth.service;

import com.bbb.songeoreum.db.domain.User;
import com.bbb.songeoreum.db.repository.UserRepository;
import com.bbb.songeoreum.exception.OAuthProviderMissMatchException;
import com.bbb.songeoreum.oauth.entity.PrincipalDetails;
import com.bbb.songeoreum.oauth.entity.ProviderType;
import com.bbb.songeoreum.oauth.info.OAuth2UserInfo;
import com.bbb.songeoreum.oauth.info.OAuth2UserInfoFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        log.debug("카카오가 사용자 정보 넘겨줬다!!!!!");

        OAuth2User user = super.loadUser(userRequest);

        try {
            return this.process(userRequest, user);
        } catch (AuthenticationException ex) {
            log.error(ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            log.error(ex.getMessage());
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    private OAuth2User process(OAuth2UserRequest userRequest, OAuth2User user) {

        ProviderType providerType = ProviderType.valueOf(userRequest.getClientRegistration().getRegistrationId().toUpperCase());

        log.debug("kakao가 넘겨준 accessToken : {}", userRequest.getAccessToken().getTokenValue());
        log.debug("providerType : {}", providerType);

        String nickname = "guest" + (userRepository.count() + 1);

        log.debug("카카오 사용자 nickname : {}", nickname);

        OAuth2UserInfo userInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(providerType, user.getAttributes());
        User savedUser = userRepository.findByKakaoId(userInfo.getProviderId());

        if (savedUser != null) {
            log.debug("카카오로 로그인을 한 적이 있는 user입니다.");

            if (!providerType.toString().equals(savedUser.getUserType())) {
                log.debug("당신이 가입한 userType : {}", savedUser.getUserType());
                throw new OAuthProviderMissMatchException(
                        "Looks like you're signed up with " + providerType +
                                " account. Please use your " + savedUser.getUserType() + " account to login."
                );
            }
        } else {
            log.debug("카카오 로그인 최초입니다.");
            savedUser = createUser(userInfo, providerType, nickname);
        }

        return new PrincipalDetails(savedUser, user.getAttributes());
    }

    private User createUser(OAuth2UserInfo userInfo, ProviderType providerType, String nickname) {
        LocalDateTime createdDate = LocalDateTime.now();

        User user = new User(providerType.toString(), userInfo.getProviderId(), nickname, createdDate);

        return userRepository.saveAndFlush(user);
    }

    private User updateUser(User user, OAuth2UserInfo userInfo) {

        log.debug("카카오 유저 updateUser 호출 ");
        String email = userInfo.getEmail();
        if (email != null && !user.getEmail().equals(email)) {
            user.updateEmail(email);
        }

        return user;
    }

}
