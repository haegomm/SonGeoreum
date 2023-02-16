package com.bbb.songeoreum.api.response;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateExperienceRes {

    @ApiModelProperty(example = "레벨")
    private int level;

    @ApiModelProperty(example = "경험치")
    private int experience;

}
