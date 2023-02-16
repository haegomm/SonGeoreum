package com.bbb.songeoreum.api.response;

import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@ToString
public class KakaoLoginRes {

    @ApiModelProperty(example = "닉네임")
    private String nickname;

    @ApiModelProperty(example = "프로필 사진 URL")
    private String picture;

    @ApiModelProperty(example = "레벨")
    private int level;

    @ApiModelProperty(example = "경험치")
    private int experience;

    @ApiModelProperty(example = "access토큰")
    private String accessToken;

    @ApiModelProperty(example = "로그인 성공시 success 그렇지 않으면 fail")
    private String message;

    @Builder
    public KakaoLoginRes(String nickname, String picture, int level, int experience, String accessToken, String message) {
        this.nickname = nickname;
        this.picture = picture;
        this.level = level;
        this.experience = experience;
        this.accessToken = accessToken;
        this.message = message;
    }

    @Builder
    public KakaoLoginRes(String message) {
        this.message = message;
    }

}
