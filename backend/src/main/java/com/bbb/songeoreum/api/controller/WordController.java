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

/**
 * {@code WordController}는 단어에 관련된 API를 처리하는 컨트롤러입니다.
 *
 * @author sonmh79
 * @version 1.0
 */
@Slf4j
@RestController
@RequestMapping("/api/words")
@RequiredArgsConstructor
@Api(tags = {"단어 API"}) // Swagger에 보여줄 명칭
public class WordController {
    private final WordService wordService;

    /**
     * 특정 조건을 만족하는 단어들을 반환합니다
     * @param categoryId 카테고리의 PK
     * @param isRandom 랜덤으로 순서를 섞을지 여부 (true/false)
     * @param isTestable 테스트 가능한지 여부 (true/false)
     * @param num 응답 시 원하는 단어의 개수
     * @return 단어 리스트를 {@code ResponseEntity}로 반환합니다
     */
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
