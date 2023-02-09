package com.bbb.songeoreum.api.service;

import com.bbb.songeoreum.api.response.WordRes;
import com.bbb.songeoreum.db.domain.Word;
import com.bbb.songeoreum.db.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * {@code WordService}는 단어 관련 로직을 처리하는 서비스입니다.
 *
 * @author sonmh79
 * @version 1.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class WordService {

    private final WordRepository wordRepository;

    /**
     * DB에서 특정 조건을 만족하는 단어들을 반환합니다.
     * @param categoryId 카테고리 PK
     * @param isRandom 랜덤으로 순서를 섞을지 여부 (true/false)
     * @param isTestable 테스트 가능한지 여부 (true/false)
     * @param num 응답 시 원하는 단어의 개수
     * @return 단어 DTO 리스트
     */
    public List<WordRes> findAllWords(Long categoryId, Boolean isRandom, Boolean isTestable, Integer num) {

        List<Word> findWords;

        if (categoryId != null) {
            findWords = wordRepository.findByCategory_Id(categoryId);
        } else {
            findWords = wordRepository.findAll();
        }

        if (isRandom != null && isRandom) {
            Collections.shuffle(findWords);
        }

        if (isTestable != null && !isTestable) {
            findWords = findWords.stream().filter(word -> word.getCategory().getIsTestable() == 'F').collect(Collectors.toList());
        }

        if (num != null) {
            findWords = findWords.stream().limit(num).collect(Collectors.toList());
        }

        log.debug("find find words: {}", findWords);

        List<WordRes> wordResList = findWords.stream().map(word -> WordRes.builder().word(word).build()).collect(Collectors.toList());

        return wordResList;
    }
}
