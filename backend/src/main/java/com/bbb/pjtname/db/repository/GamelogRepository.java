package com.bbb.pjtname.db.repository;

import com.bbb.pjtname.db.domain.Gamelog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GamelogRepository extends JpaRepository<Gamelog, Long> {
}
