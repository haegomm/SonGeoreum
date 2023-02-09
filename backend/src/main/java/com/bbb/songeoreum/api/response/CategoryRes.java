package com.bbb.songeoreum.api.response;

import com.bbb.songeoreum.db.domain.Category;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@ToString
public class CategoryRes {

    @ApiModelProperty(example = "Category Id")
    private Long id;

    @ApiModelProperty(example = "Category Name")
    private String name;

    @ApiModelProperty(example = "테스트 가능 여부 true/false")
    private String isTestable;

    // Entity to Dto
    @Builder
    public CategoryRes(Category category) {
        this.id = category.getId();
        this.name = category.getName();
        this.isTestable = (category.getIsTestable() == 'T') ? "true" : "false";
    }
}
