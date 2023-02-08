package com.bbb.songeoreum.api.service;

import com.bbb.songeoreum.api.response.WordRes;
import com.bbb.songeoreum.db.domain.Word;
import com.bbb.songeoreum.db.repository.WordRepository;
import com.sun.org.apache.xpath.internal.operations.Bool;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class WordService {

    private final WordRepository wordRepository;


    public List<WordRes> findByCategoryId(String id) {

        Long categoryId = Long.parseLong(id);
        List<Word> words = wordRepository.findByCategory_Id(categoryId);

        log.debug("find words: {}", words);

        List<WordRes> wordResList = words.stream().map(word -> WordRes.builder().word(word).build()).collect(Collectors.toList());

        return wordResList;
    }

//    public List<WordRes> findAllWords() {
//
//        List<Word> words = wordRepository.findAll();
//
//        log.debug("find all words: {}", words);
//
//        List<WordRes> wordResList = words.stream().map(word -> WordRes.builder().word(word).build()).collect(Collectors.toList());
//
//        return wordResList;
//    }

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
