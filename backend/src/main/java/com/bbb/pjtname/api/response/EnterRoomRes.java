package com.bbb.pjtname.api.response;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class EnterRoomRes {

    @ApiModelProperty(example = "Connection 토큰")
    private String token;

    @ApiModelProperty(example = "게임 시작할 타이밍인지 Boolean값")
    private boolean playGame;

    @ApiModelProperty(example = "해당 방(세션)의 session ID")
    private String sessionId;

    @ApiModelProperty(example = "상태메시지")
    private String message;


}
