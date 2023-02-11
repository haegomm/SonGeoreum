package com.bbb.songeoreum.api.controller;

import com.bbb.songeoreum.api.request.FavoriteToggleReq;
import com.bbb.songeoreum.api.response.FavoriteRes;
import com.bbb.songeoreum.api.response.SuccessRes;
import com.bbb.songeoreum.api.service.FavoriteService;
import com.bbb.songeoreum.db.domain.Favorite;
import com.bbb.songeoreum.db.domain.User;
import com.bbb.songeoreum.exception.WordNotFoundException;
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
    public ResponseEntity<SuccessRes> findByUserAndWord(@PathVariable(name = "wordId") Long wordId, HttpServletRequest httpServletRequest) {

        User user = (User) httpServletRequest.getAttribute("user");
        Long userId = user.getId();

        Favorite findFavorite = favoriteService.findFavoriteByUserAndWord(userId, wordId);

        SuccessRes successRes = SuccessRes.make(SUCCESS);

        return new ResponseEntity<SuccessRes>(successRes, HttpStatus.OK);
    }

    /**
     * 특정 단어를 나의 단어장에 추가합니다.
     * @param favoriteToggleReq {@code userId}와 {@code wordId}를 담은 DTO
     * @return 요청에 대한 응답 성공 여부 메시지를 담은 {@code ResponseEntity}
     */
    @PostMapping
    @ApiOperation("특정 단어를 나의 단어장에 추가한다.")
    public ResponseEntity<SuccessRes> saveFavorite(@RequestBody FavoriteToggleReq favoriteToggleReq, HttpServletRequest httpServletRequest) {

        User user = (User) httpServletRequest.getAttribute("user");
        Long userId = user.getId();
        Long wordId = favoriteToggleReq.getWordId();

        try {
            Favorite findFavorite = favoriteService.findFavoriteByUserAndWord(userId, wordId);
        } catch (WordNotFoundException e) {
            favoriteService.saveFavorite(userId, wordId);
        }

        SuccessRes successRes = SuccessRes.make(SUCCESS);

        return new ResponseEntity<SuccessRes>(successRes, HttpStatus.OK);
    }

    /**
     * 특정 단어를 나의 단어장에서 삭제합니다.
     * @param favoriteToggleReq {@code userId}와 {@code wordId}를 담은 DTO
     * @return 요청에 대한 응답 성공 여부 메시지를 담은 {@code ResponseEntity}
     */
    @DeleteMapping
    @ApiOperation("특정 단어를 나의 단어장에서 삭제한다.")
    public ResponseEntity<SuccessRes> deleteFavorite(@RequestBody FavoriteToggleReq favoriteToggleReq, HttpServletRequest httpServletRequest) {

        User user = (User) httpServletRequest.getAttribute("user");
        Long userId = user.getId();
        Long wordId = favoriteToggleReq.getWordId();

        try {
            Favorite findFavorite = favoriteService.findFavoriteByUserAndWord(userId, wordId);
            favoriteService.deleteFavorite(findFavorite);
        } catch (WordNotFoundException e) {
            log.debug("이미 삭제된 단어입니다.");
        }

        SuccessRes successRes = SuccessRes.make(SUCCESS);

        return new ResponseEntity<SuccessRes>(successRes, HttpStatus.OK);
    }

}
