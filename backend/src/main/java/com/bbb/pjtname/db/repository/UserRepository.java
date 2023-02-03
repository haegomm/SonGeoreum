package com.bbb.pjtname.db.repository;

import com.bbb.pjtname.db.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByEmailAndPassword(String email, String password);

    Optional<User> findByNickname(String nickname);

    User findByKakaoId(String kakaoId);


}
