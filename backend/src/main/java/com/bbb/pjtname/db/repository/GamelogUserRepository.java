package com.bbb.pjtname.db.repository;

import com.bbb.pjtname.db.domain.GamelogUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GamelogUserRepository extends JpaRepository<GamelogUser, Long> {
}
