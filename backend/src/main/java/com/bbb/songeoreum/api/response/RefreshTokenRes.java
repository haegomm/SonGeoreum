package com.bbb.songeoreum.api.response;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RefreshTokenRes {

    @ApiModelProperty(example = "access token 재발급 성공했으면 success, 실패했으면 fail")
    private String message;

    @ApiModelProperty(example = "access토큰")
    private String accessToken;

}
