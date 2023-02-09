package com.bbb.songeoreum.api.service;

import com.bbb.songeoreum.api.response.CategoryRes;
import com.bbb.songeoreum.db.domain.Category;
import com.bbb.songeoreum.db.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * {@code CategoryService}는 카테고리 로직을 처리하는 서비스입니다.
 *
 * @author sonmh79
 * @version 1.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    /**
     * DB에 있는 모든 카테고리를 조회하고 DTO로 변환합니다.
     * @return 카테고리 DTO 배열
     */
    public List<CategoryRes> findAllCategory() {

        List<Category> categoryList = categoryRepository.findAll();
        List<CategoryRes> categoryResList = categoryList.stream().map(category -> CategoryRes.builder().category(category).build()).collect(Collectors.toList());

        return categoryResList;
    }
}
