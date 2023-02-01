package com.bbb.pjtname.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.Size;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginReq {

    // 일반 회원 아이디
    @ApiModelProperty(example = "kim1234@ssafy.com") // Swagger에 예시로 보여줌.
    @Email // 이메일 형식만 가능
    @Size(max = 100)
    private String email;

    // 비밀번호
    @Size(min = 8, max = 20)
    private String password;
}
