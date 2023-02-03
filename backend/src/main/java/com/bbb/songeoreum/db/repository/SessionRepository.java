package com.bbb.songeoreum.db.repository;

import com.bbb.songeoreum.db.domain.Session;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionRepository extends JpaRepository<Session, Long> {
}
