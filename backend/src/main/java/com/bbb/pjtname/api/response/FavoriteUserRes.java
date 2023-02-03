package com.bbb.pjtname.api.response;

import com.bbb.pjtname.db.domain.Favorite;
import com.bbb.pjtname.db.domain.Word;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@ToString
public class FavoriteUserRes {

    @ApiModelProperty(example = "단어의 ID")
    private Long id;

    @ApiModelProperty(example = "단어의 이름")
    private String name;

    @ApiModelProperty(example = "단어의 컨텐츠 url")
    private String contentUrl;

    @Builder
    public FavoriteUserRes(Favorite favorite) {
        Word findWord = favorite.getWord();
        this.id = findWord.getId();
        this.name = findWord.getName();
        this.contentUrl = findWord.getContentUrl();
    }
}
