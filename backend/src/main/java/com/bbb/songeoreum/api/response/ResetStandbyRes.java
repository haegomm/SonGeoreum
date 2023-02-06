package com.bbb.songeoreum.api.response;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@NoArgsConstructor
@ToString
@Builder
@AllArgsConstructor
public class ResetStandbyRes {

    @ApiModelProperty(example = "대기가 너무 길어진 대기방 초기화 : 성공이면 success, 그렇지 않다면 fail")
    private String msg;

}
