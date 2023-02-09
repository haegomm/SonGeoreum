package com.bbb.songeoreum.api.service;

import com.bbb.songeoreum.api.response.CategoryRes;
import com.bbb.songeoreum.db.domain.Category;
import com.bbb.songeoreum.db.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryRes> findAllCategory() {

        List<Category> categoryList = categoryRepository.findAll();
        List<CategoryRes> categoryResList = categoryList.stream().map(category -> CategoryRes.builder().category(category).build()).collect(Collectors.toList());

        return categoryResList;
    }
}
