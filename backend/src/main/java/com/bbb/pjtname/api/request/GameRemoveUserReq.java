package com.bbb.pjtname.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@ToString
public class GameRemoveUserReq {

    // 퇴장한 유저가 속했던 session의 id
    @ApiModelProperty(example = "퇴장한 유저가 속했던 session의 sessionId")
    @NotBlank // Null, 빈 문자열, 스페이스만 있는 문자열 불가
    private String sessionId;

    // 퇴장한 유저의 connectionId
    @ApiModelProperty(example = "퇴장한 유저의 connectionId")
    @NotBlank // Null, 빈 문자열, 스페이스만 있는 문자열 불가
    private String connectionId;

}
