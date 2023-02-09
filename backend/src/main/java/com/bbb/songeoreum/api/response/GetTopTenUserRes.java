package com.bbb.songeoreum.api.response;

import com.bbb.songeoreum.db.domain.User;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class GetTopTenUserRes {

    // 닉네임
    @ApiModelProperty(example = "닉네임")
    private String nickname;

    // 프로필 사진 URL
    @ApiModelProperty(example = "프로필 사진 URL")
    private String picture;

    // 레벨
    @ApiModelProperty(example = "레벨")
    private int level;

    // 경험치
    @ApiModelProperty(example = "경험치")
    private int experience;

    @Builder
    public GetTopTenUserRes(User user){
        this.nickname = user.getNickname();
        this.picture = user.getPicture();
        this.level = user.getLevel();
        this.experience = user.getExperience();
    }

}
