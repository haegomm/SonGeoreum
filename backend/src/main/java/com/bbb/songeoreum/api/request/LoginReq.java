package com.bbb.songeoreum.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginReq {

    // 일반 회원 아이디
    @ApiModelProperty(example = "kim1234@ssafy.com")
    private String email;

    // 비밀번호
    private String password;
}
