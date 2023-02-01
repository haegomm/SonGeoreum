package com.bbb.pjtname.api.response;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@NoArgsConstructor
@ToString
@Builder
@AllArgsConstructor
public class RemoveUserRes {
    @ApiModelProperty(example = "나간 유저의 connection이 성공적으로 해제되었으면 success, 그렇지 않다면 fail")
    private String msg;
}
