package com.bbb.songeoreum.api.request;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@ToString
public class UserIdReq {
    @ApiModelProperty(example = "유저의 DB상 PK ID")
    @NotNull
    private Long id;

}
