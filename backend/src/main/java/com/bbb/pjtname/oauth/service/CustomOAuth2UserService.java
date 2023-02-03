package com.bbb.pjtname.oauth.service;

import com.bbb.pjtname.db.domain.User;
import com.bbb.pjtname.db.repository.UserRepository;
import com.bbb.pjtname.exception.OAuthProviderMissMatchException;
import com.bbb.pjtname.oauth.PrincipalDetails;
import com.bbb.pjtname.oauth.info.KakaoOauth2UserInfo;
import com.bbb.pjtname.oauth.info.OAuth2UserInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

// user가 카카오 로그인 한 후에 redirect 되면서 호출되는 클래스
@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    // 카카오로부터 받은 userRequest 데이터에 대한 후처리되는 함수
    // 함수 종료시 @AuthenticationPrincipal 어노테이션이 만들어짐.
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

        String provider = userRequest.getClientRegistration().getRegistrationId().toUpperCase();

        log.debug("provider : {}", provider);

        String nickname = "guest" + (userRepository.count() + 1);

        log.debug("카카오 사용자 nickname : {}", nickname);

        OAuth2UserInfo userInfo = new KakaoOauth2UserInfo(user.getAttributes());
        User savedUser = userRepository.findByKakaoId(userInfo.getProviderId());

        if (savedUser != null) {
            log.debug("카카오로 로그인을 한 적이 있는 user입니다.");

            if (!provider.equals(savedUser.getUserType())) {
                log.debug("당신이 가입한 userType : {}", savedUser.getUserType());
                throw new OAuthProviderMissMatchException(
                        "Looks like you're signed up with " + provider +
                                " account. Please use your " + savedUser.getUserType() + " account to login."
                );
            }
            updateUser(savedUser, userInfo);
        } else {
            log.debug("카카오 로그인 최초입니다.");
            savedUser = createUser(userInfo, provider, nickname);
        }

        return new PrincipalDetails(savedUser, user.getAttributes());
    }

    private User createUser(OAuth2UserInfo userInfo, String userType, String nickname) {
        LocalDateTime createdDate = LocalDateTime.now();

        User user = new User(userType, userInfo.getEmail(), userInfo.getProviderId(), nickname, createdDate);

        return userRepository.saveAndFlush(user); // save() 메서드와 달리 실행중(트랜잭션)에 즉시 data를 flush 함.
    }

    private User updateUser(User user, OAuth2UserInfo userInfo) {

        // 카카오톡 사용자가 원래 이메일이 등록되어 있지 않았는데 이메일 등록한 경우 이메일 추가 해줌.
        if (userInfo.getEmail() != null && !user.getEmail().equals(userInfo.getEmail())) {
            user.updateEmail(userInfo.getEmail());
        }

        return user;
    }

}
