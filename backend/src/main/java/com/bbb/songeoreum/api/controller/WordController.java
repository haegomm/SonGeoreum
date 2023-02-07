package com.bbb.songeoreum.api.controller;


import com.bbb.songeoreum.api.response.WordRes;
import com.bbb.songeoreum.api.service.WordService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/words")
@RequiredArgsConstructor
@Api(tags = {"단어 API"}) // Swagger에 보여줄 명칭
public class WordController {

    private final WordService wordService;

    @GetMapping("/category/{categoryId}")
    @ApiOperation(value = "특정 카테고리에 속하는 단어를 조회합니다.")
    public ResponseEntity<List<WordRes>> findWordsByCategory(@PathVariable(name = "categoryId") String categoryId) {

        log.debug("Category Id: {}", categoryId);

        List<WordRes> words = wordService.findByCategoryId(categoryId);

        return new ResponseEntity<List<WordRes>>(words, HttpStatus.OK);
    }

    @GetMapping
    @ApiOperation("모든 단어를 리스트에 담아 응답합니다.")
    public ResponseEntity<List<WordRes>> findWords() {

        List<WordRes> words = wordService.findAllWords();

        return new ResponseEntity<List<WordRes>>(words, HttpStatus.OK);

    }

}
