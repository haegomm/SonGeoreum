package com.bbb.songeoreum.db.repository;

import com.bbb.songeoreum.db.domain.GamelogUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GamelogUserRepository extends JpaRepository<GamelogUser, Long> {
}
