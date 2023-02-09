package com.bbb.songeoreum.api.response;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LogoutRes {

    @ApiModelProperty(example = "로그아웃 성공했으면 success, 실패했으면 fail")
    private String message;
}
