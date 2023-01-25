package com.bbb.pjtname.db.repository;

import com.bbb.pjtname.db.domain.Session;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionRepository extends JpaRepository<Session, Long> {
}
