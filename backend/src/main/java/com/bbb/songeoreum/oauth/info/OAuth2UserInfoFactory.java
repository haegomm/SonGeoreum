package com.bbb.songeoreum.oauth.info;

import com.bbb.songeoreum.oauth.entity.ProviderType;

import java.util.Map;

public class OAuth2UserInfoFactory {

    public static OAuth2UserInfo getOAuth2UserInfo(ProviderType providerType, Map<String, Object> attributes) {
        switch (providerType) {
            case KAKAO:
                return new KakaoOauth2UserInfo(attributes);
            default:
                throw new IllegalArgumentException("유효하지 않은 Provider Type 입니다.");
        }
    }

}
