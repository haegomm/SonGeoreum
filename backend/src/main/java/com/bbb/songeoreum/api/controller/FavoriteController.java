package com.bbb.songeoreum.api.controller;

import com.bbb.songeoreum.api.request.FavoriteToggleReq;
import com.bbb.songeoreum.api.response.FavoriteToggleRes;
import com.bbb.songeoreum.api.response.FavoriteUserRes;
import com.bbb.songeoreum.api.response.FavoriteUserWordRes;
import com.bbb.songeoreum.api.service.FavoriteService;
import com.bbb.songeoreum.db.domain.Favorite;
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
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@Api(tags = {"나의 단어장 API"}) // Swagger에 보여줄 명칭
public class FavoriteController {

    private final FavoriteService favoriteService;

    private final String SUCCESS = "success";
    private final String FAIL = "fail";

    @GetMapping("/user/{userId}/words")
    @ApiOperation(value = "나의 단어장에 등록된 단어들을 리스트에 담아 응답한다.")
    public ResponseEntity<List<FavoriteUserRes>> findByUser(@PathVariable(name = "userId") String userId) {

        List<FavoriteUserRes> favoriteWords = favoriteService.findByUser(userId);

        return new ResponseEntity<List<FavoriteUserRes>>(favoriteWords, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}/word/{wordId}")
    @ApiOperation(value = "나의 단어장에 있는 단어인지 확인한다.")
    public ResponseEntity<FavoriteUserWordRes> findByUserAndWord(@PathVariable(name = "userId") String userId, @PathVariable(name = "wordId") String wordId) {

        log.debug("USER ID: {}", userId);
        log.debug("WORD ID: {}", wordId);

        String msg = FAIL;

        Favorite findFavorite = favoriteService.findFavoriteByUserAndWord(userId, wordId);
        if (findFavorite != null) msg = SUCCESS;

        FavoriteUserWordRes favoriteUserWordRes = FavoriteUserWordRes.builder().msg(msg).build();

        return new ResponseEntity<FavoriteUserWordRes>(favoriteUserWordRes, HttpStatus.OK);
    }

    @PostMapping
    @ApiOperation("특정 단어를 나의 단어장에 추가한다.")
    public ResponseEntity<FavoriteToggleRes> saveFavorite(@RequestBody FavoriteToggleReq favoriteToggleReq) {

        log.debug("Fovorite Save Request: {} ", favoriteToggleReq);

        String msg = SUCCESS;

        String userId = favoriteToggleReq.getUserId();
        String wordId = favoriteToggleReq.getWordId();

        Favorite findFavorite = favoriteService.findFavoriteByUserAndWord(userId, wordId);
        if (findFavorite == null) {
            favoriteService.saveFavorite(userId, wordId);
        }

        FavoriteToggleRes favoriteToggleRes = FavoriteToggleRes.builder().msg(msg).build();

        return new ResponseEntity<FavoriteToggleRes>(favoriteToggleRes, HttpStatus.OK);
    }

    @DeleteMapping
    @ApiOperation("특정 단어를 나의 단어장에서 삭제한다.")
    public ResponseEntity<FavoriteToggleRes> deleteFavorite(@RequestBody FavoriteToggleReq favoriteToggleReq) {

        log.debug("Fovorite Delete Request: {} ", favoriteToggleReq);

        String msg = SUCCESS;

        String userId = favoriteToggleReq.getUserId();
        String wordId = favoriteToggleReq.getWordId();

        Favorite findFavorite = favoriteService.findFavoriteByUserAndWord(userId, wordId);
        if (findFavorite != null) {
            favoriteService.deleteFavorite(findFavorite);
        }

        FavoriteToggleRes favoriteToggleRes = FavoriteToggleRes.builder().msg(msg).build();

        return new ResponseEntity<FavoriteToggleRes>(favoriteToggleRes, HttpStatus.OK);
    }

}
