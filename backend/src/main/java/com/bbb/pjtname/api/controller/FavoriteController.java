package com.bbb.pjtname.api.controller;

import com.bbb.pjtname.api.response.FavoriteUserRes;
import com.bbb.pjtname.api.response.FavoriteUserWordRes;
import com.bbb.pjtname.api.service.FavoriteService;
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
@RequestMapping("/favorites")
@RequiredArgsConstructor
@Api(tags = {"나의 단어장 API"}) // Swagger에 보여줄 명칭
public class FavoriteController {

    private final FavoriteService favoriteService;

    @GetMapping("user/{userId}/words")
    @ApiOperation(value = "나의 단어장에 등록된 단어들을 리스트에 담아 응답한다.")
    public ResponseEntity<List<FavoriteUserRes>> findByUser(@PathVariable(name = "userId") String userId) {

        List<FavoriteUserRes> favoriteWords = favoriteService.findByUser(userId);

        return new ResponseEntity<List<FavoriteUserRes>>(favoriteWords, HttpStatus.OK);
    }

    @GetMapping("user/{userId}/word/{wordId}")
    @ApiOperation(value = "나의 단어장에 있는 단어인지 확인한다.")
    public ResponseEntity<FavoriteUserWordRes> findByUserAndWord(@PathVariable(name = "userId") String userId, @PathVariable(name = "wordId") String wordId) {

        log.debug("USER ID: {}", userId);
        log.debug("WORD ID: {}", wordId);

        String msg = "fail";

        if (favoriteService.findFavoriteByUserAndWord(userId,wordId)) msg = "success";

        FavoriteUserWordRes favoriteUserWordRes = FavoriteUserWordRes.builder().msg(msg).build();

        return new ResponseEntity<FavoriteUserWordRes>(favoriteUserWordRes, HttpStatus.OK);
    }
}
