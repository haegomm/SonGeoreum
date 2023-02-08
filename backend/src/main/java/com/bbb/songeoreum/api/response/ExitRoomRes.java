package com.bbb.songeoreum.api.response;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@NoArgsConstructor
@ToString
@Builder
@AllArgsConstructor
public class ExitRoomRes {

    @ApiModelProperty(example = "게임 종료, 모든 유저 퇴출, 게임로그 DB저장이 성공이면 success, 그렇지 않다면 fail")
    private String message;

}
