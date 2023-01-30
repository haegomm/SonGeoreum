package com.bbb.pjtname.api.response;

import com.bbb.pjtname.db.domain.Category;
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

    @ApiModelProperty(example = "테스트 가능 여부 Y/N")
    private Character isTestable;

    // Entity to Dto
    @Builder
    public CategoryRes(Category category) {
        this.id = category.getId();
        this.name = category.getName();
        this.isTestable = category.getIsTestable();
    }
}
