package com.bbb.songeoreum.api.service;

import com.bbb.songeoreum.api.response.FavoriteRes;
import com.bbb.songeoreum.db.domain.Favorite;
import com.bbb.songeoreum.db.domain.User;
import com.bbb.songeoreum.db.domain.Word;
import com.bbb.songeoreum.db.repository.FavoriteRepository;
import com.bbb.songeoreum.db.repository.UserRepository;
import com.bbb.songeoreum.db.repository.WordRepository;
import com.bbb.songeoreum.exception.UserNotFoundException;
import com.bbb.songeoreum.exception.WordNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * {@code FavoriteService}는 나의 단어장 로직을 처리하는 서비스입니다.
 *
 * @author sonmh79
 * @version 1.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final WordRepository wordRepository;

    /**
     * DB에서 사용자 PK에 해당하는 나의 단어장 결과를 조회합니다.
     * @param userId 사용자 PK
     * @param isRandom 셔플 여부 (true/false)
     * @return 나의 단어장 DTO 리스트
     */
    public List<FavoriteRes> findByUser(Long userId, Boolean isRandom) {

        List<Favorite> favorites = favoriteRepository.findByUser_Id(userId);

        if (isRandom != null && isRandom) {
            Collections.shuffle(favorites);
        }

        log.debug("favorite list: {}", favorites);

        List<FavoriteRes> findFavorites = favorites.stream().map(favorite -> FavoriteRes.builder().favorite(favorite).categoryId(favorite.getWord().getCategory().getId()).build()).collect(Collectors.toList());

        return findFavorites;
    }

    /**
     * DB에서 사용자 PK와 단어 PK에 해당하는 나의 단어장 결과를 조회합니다.
     * @param userId 사용자 PK
     * @param wordId 단어 PK
     * @return 나의 단어장 리스트
     */
    public Favorite findFavoriteByUserAndWord(Long userId, Long wordId) {

        Favorite findFavorite = favoriteRepository.findByUser_IdAndWord_Id(userId, wordId);

        if (findFavorite == null) throw new WordNotFoundException();

        return findFavorite;
    }

    /**
     * DB에 나의 단어장 데이터를 저장한다.
     * @param userId 사용자 PK
     * @param wordId 단어 PK
     */
    public void saveFavorite(Long userId, Long wordId) {

        User findUser = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException());
        Word findWord = wordRepository.findById(wordId).orElseThrow(() -> new WordNotFoundException());

        Favorite createdFavorite = Favorite.builder().word(findWord).user(findUser).build();

        favoriteRepository.save(createdFavorite);
    }

    /**
     * DB에서 사용자 PK와 단어 PK에 해당하는 나의 단어장을 삭제합니다.
     * @param favorite 나의 단어장 객체
     */
    public void deleteFavorite(Favorite favorite) {

        favoriteRepository.delete(favorite);
    }
}
