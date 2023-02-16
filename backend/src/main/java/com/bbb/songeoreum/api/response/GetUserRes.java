package com.bbb.songeoreum.api.response;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class GetUserRes {

    @ApiModelProperty(example = "유저의 DB상 PK")
    private Long id;

    @ApiModelProperty(example = "사용자 타입(NORMAL:일반,  KAKAO:카카오톡)")
    private String userType;

    @ApiModelProperty(example = "일반 회원 아이디")
    private String email;

    @ApiModelProperty(example = "카카오톡 회원 아이디")
    private String kakaoId;

    @ApiModelProperty(example = "닉네임")
    private String nickname;

    @ApiModelProperty(example = "프로필 사진 URL")
    private String picture;

    @ApiModelProperty(example = "레벨")
    private int level;

    @ApiModelProperty(example = "경험치")
    private int experience;

}
