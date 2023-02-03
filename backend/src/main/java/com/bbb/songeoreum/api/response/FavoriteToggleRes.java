package com.bbb.songeoreum.api.response;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@NoArgsConstructor
@ToString
@Builder
@AllArgsConstructor
public class FavoriteToggleRes {

    @ApiModelProperty(example = "결과 메시지")
    private String msg;
}
