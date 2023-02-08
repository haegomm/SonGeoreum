package com.bbb.songeoreum.api.controller;


import com.bbb.songeoreum.api.response.WordRes;
import com.bbb.songeoreum.api.service.WordService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/words")
@RequiredArgsConstructor
@Api(tags = {"단어 API"}) // Swagger에 보여줄 명칭
public class WordController {

    private final WordService wordService;

    @GetMapping
    @ApiOperation("특정 조건을 만족하는 모든 단어를 리스트에 담아 응답한다.")
    public ResponseEntity<List<WordRes>> findWords(
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "isRandom", required = false) Boolean isRandom,
            @RequestParam(value = "isTestable", required = false) Boolean isTestable,
            @RequestParam(value = "num", required = false) Integer num
    ) {

        log.info("categoryId: {}", categoryId);
        log.info("random: {}", isRandom);
        log.info("istTestable: {}", isTestable);
        log.info("num: {}", num);

        List<WordRes> words = wordService.findAllWords(categoryId, isRandom, isTestable, num);

        return new ResponseEntity<List<WordRes>>(words, HttpStatus.OK);

    }

}
