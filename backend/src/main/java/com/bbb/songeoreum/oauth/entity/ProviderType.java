package com.bbb.songeoreum.oauth.entity;

import lombok.Getter;

// 확장성을 위해 생성한 클래스
// 나중에 카카오 뿐만이 아니라 구글, 네이버 등등 다른 소셜 로그인을 도입할지도 모르기 때문에 만들었음.
@Getter
public enum ProviderType {
    KAKAO;
}
