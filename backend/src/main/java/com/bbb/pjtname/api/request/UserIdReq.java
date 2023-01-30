package com.bbb.pjtname.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@ToString
public class UserIdReq {
    @ApiModelProperty(example = "유저의 DB상 PK ID")
    @NotBlank // Null, 빈 문자열, 스페이스만 있는 문자열 불가
    private Long id;

}
