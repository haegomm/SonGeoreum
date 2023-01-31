package com.bbb.pjtname.api.service;

import com.bbb.pjtname.api.response.FavoriteUserRes;
import com.bbb.pjtname.db.domain.Favorite;
import com.bbb.pjtname.db.domain.User;
import com.bbb.pjtname.db.domain.Word;
import com.bbb.pjtname.db.repository.FavoriteRepository;
import com.bbb.pjtname.db.repository.UserRepository;
import com.bbb.pjtname.db.repository.WordRepository;
import com.bbb.pjtname.exception.UserNotFoundException;
import com.bbb.pjtname.exception.WordNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final WordRepository wordRepository;

    public List<FavoriteUserRes> findByUser(String id) {

        Long userId = Long.parseLong(id);
        List<Favorite> favorites = favoriteRepository.findByUser_Id(userId);

        log.debug("favorite list: {}",favorites);

        List<FavoriteUserRes> findFavorites = favorites.stream().map(favorite -> FavoriteUserRes.builder().favorite(favorite).build()).collect(Collectors.toList());

        return findFavorites;
    }

    public Favorite findFavoriteByUserAndWord(String uId, String wId) {

        Long userId = Long.parseLong(uId);
        Long wordId = Long.parseLong(wId);

        Favorite findFavorite = favoriteRepository.findByUser_IdAndWord_Id(userId,wordId);

        return findFavorite;
    }

    public void saveFavorite(String uId, String wId) {

        Long userId = Long.parseLong(uId);
        Long wordId = Long.parseLong(wId);

        User findUser = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException());
        Word findWord = wordRepository.findById(wordId).orElseThrow(() -> new WordNotFoundException());

        Favorite createdFavorite = Favorite.builder().word(findWord).user(findUser).build();

        favoriteRepository.save(createdFavorite);
    }

    public void deleteFavorite(Favorite favorite) {

        favoriteRepository.delete(favorite);
    }
}
