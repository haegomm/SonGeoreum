package com.bbb.songeoreum.api.response;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@NoArgsConstructor
@ToString
public class LoginRes {

    //pk
    @ApiModelProperty(example = "유저의 DB상 PK")
    private Long id;

    // 사용자 타입(NORMAL:일반,  KAKAO:카카오톡)
    @ApiModelProperty(example = "사용자 타입(NORMAL:일반,  KAKAO:카카오톡)")
    private String userType;

    // 일반 회원 아이디
    @ApiModelProperty(example = "일반 회원 아이디")
    private String email;

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

    // refresh토큰
    @ApiModelProperty(example = "refresh토큰")
    private String refreshToken;

    // access토큰
    @ApiModelProperty(example = "access토큰")
    private String accessToken;

    @ApiModelProperty(example = "로그인 성공시 success 그렇지 않으면 fail")
    private String message;

    @Builder
    public LoginRes(Long id, String userType, String email, String nickname, String picture, int level, int experience, String refreshToken, String accessToken, String message) {
        this.id = id;
        this.userType = userType;
        this.email = email;
        this.nickname = nickname;
        this.picture = picture;
        this.level = level;
        this.experience = experience;
        this.refreshToken = refreshToken;
        this.accessToken = accessToken;
        this.message = message;
    }

    @Builder
    public LoginRes(String msg) {
        this.message = message;
    }

}
