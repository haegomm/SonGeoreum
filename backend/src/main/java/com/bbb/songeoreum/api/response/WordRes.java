package com.bbb.songeoreum.api.response;

import com.bbb.songeoreum.db.domain.Word;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@ToString
public class WordRes {

    @ApiModelProperty(example = "단어의 ID")
    private Long id;

    @ApiModelProperty(example = "단어의 이름")
    private String name;

    @ApiModelProperty(example = "단어의 컨텐츠 url")
    private String contentUrl;

    @Builder
    public WordRes(Word word) {
        this.id = word.getId();
        this.name = word.getName();
        this.contentUrl = word.getContentUrl();
    }
}
