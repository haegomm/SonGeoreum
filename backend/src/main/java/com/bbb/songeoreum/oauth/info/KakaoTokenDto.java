package com.bbb.songeoreum.oauth.info;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@NoArgsConstructor
public class KakaoTokenDto {

    // 카카오가 넘겨주는 access token
    String accessToken;
}
