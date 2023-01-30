package com.bbb.pjtname.api.service;

import com.bbb.pjtname.api.response.FavoriteUserRes;
import com.bbb.pjtname.db.domain.Favorite;
import com.bbb.pjtname.db.repository.FavoriteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;

    public List<FavoriteUserRes> findByUser(String id) {

        Long userId = Long.parseLong(id);
        List<Favorite> favorites = favoriteRepository.findByUser_Id(userId);

        log.debug("favorite list: {}",favorites);

        return favorites != null ? favorites.stream().map(favorite -> FavoriteUserRes.builder().favorite(favorite).build()).collect(Collectors.toList()) : null;
    }

    public Boolean findFavoriteByUserAndWord(String uId, String wId) {

        Long userId = Long.parseLong(uId);
        Long wordId = Long.parseLong(wId);

        Favorite findFavortie = favoriteRepository.findByUser_IdAndWord_Id(userId,wordId);

        log.debug("favorite: {}",findFavortie);

        return findFavortie != null ? true : false;
    }

}
