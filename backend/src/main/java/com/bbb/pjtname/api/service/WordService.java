package com.bbb.pjtname.api.service;

import com.bbb.pjtname.api.response.WordRes;
import com.bbb.pjtname.db.domain.Word;
import com.bbb.pjtname.db.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class WordService {

    private final WordRepository wordRepository;


    public List<WordRes> findByCategoryId(String id) {

        Long categoryId = Long.parseLong(id);
        List<Word> words =  wordRepository.findByCategory_Id(categoryId);

        log.debug("find words: {}",words);

        return words != null ? words.stream().map(word -> WordRes.builder().word(word).build()).collect(Collectors.toList()) : null;
    }

    public List<WordRes> findAllWords() {

        List<Word> words = wordRepository.findAll();

        log.debug("find all words: {}", words);

        return words != null ? words.stream().map(word -> WordRes.builder().word(word).build()).collect(Collectors.toList()) : null;
    }
}
