package com.bbb.songeoreum.oauth.info;

import lombok.extern.slf4j.Slf4j;

import java.util.Map;

@Slf4j
public class KakaoOauth2UserInfo implements OAuth2UserInfo {

    private Map<String, Object> attributes; // oauth2User.getAttributes()

    public KakaoOauth2UserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    @Override
    public String getProviderId() {
        String id = attributes.get("id").toString();

        log.debug("kakao 아이디 : {}", id);

        return id;
    }

    @Override
    public String getProvider() {
        return "KAKAO";
    }

    @Override
    public String getEmail() {
        Map<String, Object> kakao_account = (Map<String, Object>) attributes.get("kakao_account");

        String email = (String) kakao_account.get("email");
        log.debug("kakao에 등록된 이메일 : {}", email);

        return email;
    }

    @Override
    public String getName() {
        Map<String, Object> properties = (Map<String, Object>) attributes.get("properties");

        if (properties == null) {
            return null;
        }

        String nickname = (String) properties.get("nickname");
        log.debug("kakao에 등록된 닉네임 : {}", nickname);

        return nickname;
    }
}
