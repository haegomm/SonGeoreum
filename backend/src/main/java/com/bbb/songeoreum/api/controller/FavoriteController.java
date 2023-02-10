package com.bbb.songeoreum.api.controller;

import com.bbb.songeoreum.api.request.FavoriteToggleReq;
import com.bbb.songeoreum.api.response.FavoriteToggleRes;
import com.bbb.songeoreum.api.response.FavoriteRes;
import com.bbb.songeoreum.api.response.FavoriteWordRes;
import com.bbb.songeoreum.api.service.FavoriteService;
import com.bbb.songeoreum.db.domain.Favorite;
import com.bbb.songeoreum.db.domain.User;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * {@code FavoriteController}는 나의 단어장 API를 처리하는 컨트롤러입니다.
 *
 * @author sonmh79
 * @version 1.0
 */

@Slf4j
@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@Api(tags = {"나의 단어장 API"}) // Swagger에 보여줄 명칭
public class FavoriteController {

    private final FavoriteService favoriteService;

    private final String SUCCESS = "success";
    private final String FAIL = "fail";

    /**
     * 나의 단어장에 등록된 단어들을 리스트에 담아 응답한다
     * @param isRandom 셔플 여부 (true/false)
     * @return 나의 단어장에 있는 단어 리스트를 담은 {@code ResponseEntity}
     */
    @GetMapping
    @ApiOperation(value = "나의 단어장에 등록된 단어들을 리스트에 담아 응답한다.")
    public ResponseEntity<List<FavoriteRes>> findByUser(@RequestParam(required = false) Boolean isRandom, HttpServletRequest httpServletRequest) {

        User user = (User) httpServletRequest.getAttribute("user");
        Long userId = user.getId();

        List<FavoriteRes> favoriteWords = favoriteService.findByUser(userId, isRandom);

        return new ResponseEntity<List<FavoriteRes>>(favoriteWords, HttpStatus.OK);
    }

    /**
     * 나의 단어장에 있는 단어인지 확인합니다.
     * @param wordId 단어 PK
     * @return 요청에 대한 응답 성공 여부 메시지를 담은 {@code ResponseEntity}
     */
    @GetMapping("/word/{wordId}")
    @ApiOperation(value = "나의 단어장에 있는 단어인지 확인한다.")
    public ResponseEntity<FavoriteWordRes> findByUserAndWord(@PathVariable(name = "wordId") Long wordId, HttpServletRequest httpServletRequest) {

        String msg = FAIL;

        User user = (User) httpServletRequest.getAttribute("user");
        Long userId = user.getId();

        log.info("userId: {}", userId);
        log.info("wordId: {}", wordId);

        Favorite findFavorite = favoriteService.findFavoriteByUserAndWord(userId, wordId);
        if (findFavorite != null) msg = SUCCESS;

        FavoriteWordRes favoriteUserWordRes = FavoriteWordRes.builder().message(msg).build();

        return new ResponseEntity<FavoriteWordRes>(favoriteUserWordRes, HttpStatus.OK);
    }

    /**
     * 특정 단어를 나의 단어장에 추가합니다.
     * @param favoriteToggleReq {@code userId}와 {@code wordId}를 담은 DTO
     * @return 요청에 대한 응답 성공 여부 메시지를 담은 {@code ResponseEntity}
     */
    @PostMapping
    @ApiOperation("특정 단어를 나의 단어장에 추가한다.")
    public ResponseEntity<FavoriteToggleRes> saveFavorite(@RequestBody FavoriteToggleReq favoriteToggleReq, HttpServletRequest httpServletRequest) {

        log.debug("Fovorite Save Request: {} ", favoriteToggleReq);

        User user = (User) httpServletRequest.getAttribute("user");
        Long userId = user.getId();
        Long wordId = favoriteToggleReq.getWordId();

        String msg = SUCCESS;

        Favorite findFavorite = favoriteService.findFavoriteByUserAndWord(userId, wordId);

        if (findFavorite == null) {
            favoriteService.saveFavorite(userId, wordId);
        }

        FavoriteToggleRes favoriteToggleRes = FavoriteToggleRes.builder().message(msg).build();

        return new ResponseEntity<FavoriteToggleRes>(favoriteToggleRes, HttpStatus.OK);
    }

    /**
     * 특정 단어를 나의 단어장에서 삭제합니다.
     * @param favoriteToggleReq {@code userId}와 {@code wordId}를 담은 DTO
     * @return 요청에 대한 응답 성공 여부 메시지를 담은 {@code ResponseEntity}
     */
    @DeleteMapping
    @ApiOperation("특정 단어를 나의 단어장에서 삭제한다.")
    public ResponseEntity<FavoriteToggleRes> deleteFavorite(@RequestBody FavoriteToggleReq favoriteToggleReq, HttpServletRequest httpServletRequest) {

        log.debug("Fovorite Delete Request: {} ", favoriteToggleReq);

        String msg = SUCCESS;

        User user = (User) httpServletRequest.getAttribute("user");
        Long userId = user.getId();
        Long wordId = favoriteToggleReq.getWordId();

        Favorite findFavorite = favoriteService.findFavoriteByUserAndWord(userId, wordId);
        if (findFavorite != null) {
            favoriteService.deleteFavorite(findFavorite);
        }

        FavoriteToggleRes favoriteToggleRes = FavoriteToggleRes.builder().message(msg).build();

        return new ResponseEntity<FavoriteToggleRes>(favoriteToggleRes, HttpStatus.OK);
    }

}
