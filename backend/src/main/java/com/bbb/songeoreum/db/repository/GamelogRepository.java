package com.bbb.songeoreum.db.repository;

import com.bbb.songeoreum.db.domain.Gamelog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GamelogRepository extends JpaRepository<Gamelog, Long> {
}
