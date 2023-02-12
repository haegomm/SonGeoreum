package com.bbb.songeoreum.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class InsertUserReq {

    // 사용자 타입(NORMAL:일반,  KAKAO:카카오톡)
    @ApiModelProperty(example = "사용자 타입(NORMAL:일반,  KAKAO:카카오톡)") // Swagger에 예시로 보여줌.
    @NotBlank // Null, 빈 문자열, 스페이스만 있는 문자열 불가
    private String userType;

    // 일반 회원 아이디
    @ApiModelProperty(example = "kim1234@ssafy.com") // Swagger에 예시로 보여줌.
    @Email // 이메일 형식만 가능
    @Size(max = 100)
    private String email;

    // 비밀번호
    @Size(min = 8, max = 20)
    private String password;

    // 닉네임
    @NotBlank // Null, 빈 문자열, 스페이스만 있는 문자열 불가
    @Size(min = 2, max = 10)
    private String nickname;

    // 프로필 사진 URL
    private String picture;
}
