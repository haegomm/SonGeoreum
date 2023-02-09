package com.bbb.songeoreum.db.repository;

import com.bbb.songeoreum.db.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByEmailAndPassword(String email, String password);

    Optional<User> findByNickname(String nickname);

    User findByKakaoId(String kakaoId);

    @Query("select u from User u order by u.experience desc")
    List<User> findAllOrderByExperienceDesc();


}
