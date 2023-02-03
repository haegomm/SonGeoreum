package com.bbb.songeoreum.api.response;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Column;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class LoginRes {

    //pk
    @ApiModelProperty(value = "유저의 DB상 PK")
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

}
