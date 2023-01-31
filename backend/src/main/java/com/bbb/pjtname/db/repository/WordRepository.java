package com.bbb.pjtname.db.repository;

import com.bbb.pjtname.db.domain.Word;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WordRepository extends JpaRepository<Word, Long> {

    List<Word> findByCategory_Id(Long categoryId);

}
