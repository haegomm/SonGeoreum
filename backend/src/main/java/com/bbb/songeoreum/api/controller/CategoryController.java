package com.bbb.songeoreum.api.controller;

import com.bbb.songeoreum.api.response.CategoryRes;
import com.bbb.songeoreum.api.service.CategoryService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * {@code FavoriteController}는 카테고리 API를 처리하는 컨트롤러입니다.
 *
 * @author sonmh79
 * @version 1.0
 */
@Slf4j
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Api(tags = {"카테고리 API"}) // Swagger에 보여줄 명칭
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * 카테고리의 목록을 조회합니다.
     * @return 카테고리 리스트를 담은 {@code ResponseEntity}
     */
    @GetMapping
    @ApiOperation(value = "카테고리의 목록을 조회합니다.")
    public ResponseEntity<List<CategoryRes>> findCategoryList() {

        List<CategoryRes> categoryResList = categoryService.findAllCategory();

        log.debug("find category list: {}", categoryResList);

        return new ResponseEntity<List<CategoryRes>>(categoryResList, HttpStatus.OK);
    }
}
