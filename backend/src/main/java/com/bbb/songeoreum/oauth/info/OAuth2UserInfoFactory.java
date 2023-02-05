package com.bbb.songeoreum.oauth.info;

import com.bbb.songeoreum.oauth.entity.ProviderType;

import java.util.Map;

// 이 클래스도 나중에 네이버, 구글 등의 소셜 로그인이 추가될 수도 있어서 확장성을 위해 만든 클래스
public class OAuth2UserInfoFactory {

    public static OAuth2UserInfo getOAuth2UserInfo(ProviderType providerType, Map<String, Object> attributes){
        switch (providerType){
            case KAKAO: return new KakaoOauth2UserInfo(attributes);
            default: throw new IllegalArgumentException("유효하지 않은 Provider Type 입니다.");
        }
    }

}
