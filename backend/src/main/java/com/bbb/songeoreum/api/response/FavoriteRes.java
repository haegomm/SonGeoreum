package com.bbb.songeoreum.api.response;

import com.bbb.songeoreum.db.domain.Favorite;
import com.bbb.songeoreum.db.domain.Word;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@ToString
public class FavoriteRes {

    @ApiModelProperty(example = "단어의 ID")
    private Long id;

    @ApiModelProperty(example = "단어의 이름")
    private String name;

    @ApiModelProperty(example = "단어의 컨텐츠 url")
    private String contentUrl;

    @ApiModelProperty(example = "카테고리 ID")
    private Long categoryId;

    @Builder
    public FavoriteRes(Favorite favorite, Long categoryId) {
        Word findWord = favorite.getWord();
        this.id = findWord.getId();
        this.name = findWord.getName();
        this.contentUrl = findWord.getContentUrl();
        this.categoryId = categoryId;
    }
}
