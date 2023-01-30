package com.bbb.pjtname.api.service;

import com.bbb.pjtname.api.request.InsertUserReq;
import com.bbb.pjtname.db.domain.User;
import com.bbb.pjtname.db.repository.UserRepository;
import com.bbb.pjtname.exception.DuplicateException;
import com.bbb.pjtname.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)  // 트랜잭션 안에서만 데이터 변경하게 설정
public class UserService {

    private final UserRepository userRepository;

    // 이메일 중복 체크
    public void duplicateEmail(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new DuplicateException("중복된 이메일입니다.");
        }
    }

    // 닉네임 중복 체크
    public void duplicateNickname(String nickname) {
        if (userRepository.findByNickname(nickname) != null) {
            throw new DuplicateException("중복된 닉네임입니다.");
        }

    }

    // 회원가입
    @Transactional
    public void insertUser(InsertUserReq insertUserReq) {

        LocalDateTime createDate = LocalDateTime.now();

        User user = User.builder().insertUserReq(insertUserReq).createDate(createDate).build();

        // 이메일 중복 체크
        duplicateEmail(user.getEmail());

        // 닉네임 중복 체크
        duplicateNickname(user.getNickname());

        userRepository.save(user);
    }


    // 로그인
    public User loginUser(String email, String password) throws NotFoundException {

        User loginUser = userRepository.findByEmailAndPassword(email, password).orElseThrow(NotFoundException::new);

        return loginUser;
    }

    @Transactional
    public void saveRefreshToken(String email, String refreshToken) throws NotFoundException {

        User user = userRepository.findByEmail(email).orElseThrow(NotFoundException::new);
        user.saveRefreshToken(refreshToken);
    }


    public User getRefreshToken(String email) throws NotFoundException {

        return userRepository.findByEmail(email).orElseThrow(NotFoundException::new);
    }


    @Transactional
    public void deleteRefreshToken(String email) throws NotFoundException {
        User member = userRepository.findByEmail(email).orElseThrow(NotFoundException::new);
        log.debug("member : {} ", member);
        member.deleteRefreshToken();
    }

}
