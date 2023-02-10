package com.bbb.songeoreum.api.response;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@NoArgsConstructor
@ToString
public class LoginRes {

    // 닉네임
    @ApiModelProperty(example = "닉네임")
    private String nickname;

    // 프로필 사진 URL
    @ApiModelProperty(example = "프로필 사진 URL")
    private String picture;

    // 레벨
    @ApiModelProperty(example = "레벨")
    private int level;

    // 경험치
    @ApiModelProperty(example = "경험치")
    private int experience;

    // access토큰
    @ApiModelProperty(example = "access토큰")
    private String accessToken;

    @ApiModelProperty(example = "로그인 성공시 success 그렇지 않으면 fail")
    private String message;

    @Builder
    public LoginRes(String nickname, String picture, int level, int experience, String accessToken, String message) {
        this.nickname = nickname;
        this.picture = picture;
        this.level = level;
        this.experience = experience;
        this.accessToken = accessToken;
        this.message = message;
    }

    @Builder
    public LoginRes(String message) {
        this.message = message;
    }

}
