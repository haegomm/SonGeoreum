package com.bbb.songeoreum.api.response;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@NoArgsConstructor
@ToString
@Builder
@AllArgsConstructor
public class FavoriteWordRes {

    @ApiModelProperty(example = "나의 단어장에 있다면 success, 그렇지 않다면 fail")
    private String message;

}
