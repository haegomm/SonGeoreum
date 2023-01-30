package com.bbb.pjtname.api.controller;

import com.bbb.pjtname.api.response.CategoryRes;
import com.bbb.pjtname.api.service.CategoryService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@Api(tags = {"카테고리 API"}) // Swagger에 보여줄 명칭
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @ApiOperation(value = "카테고리의 목록을 조회합니다.")
    public List<CategoryRes> findCategoryList() {

        List<CategoryRes> categoryResList = categoryService.findAllCategory();

        log.debug("find category list: {}", categoryResList);

        return categoryResList;
    }
}
