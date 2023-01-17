package com.ssafy.bbb.api.service;

import com.ssafy.bbb.api.request.InsertUserReq;
import com.ssafy.bbb.db.domain.User;
import com.ssafy.bbb.db.repository.UserRepository;
import com.ssafy.bbb.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public void insertUser(InsertUserReq insertUserReq) {

        User user = User.builder().insertUserReq(insertUserReq).build();

        //이메일 중복 체크
        duplicateEmail(user.getEmail());

        userRepository.save(user);
    }

    //이메일 중복 체크
    private void duplicateEmail(String email) {
        if(userRepository.findByEmail(email).isPresent()){
            throw new NotFoundException("중복된 이메일입니다.");
        }
    }

    //로그인
    public User loginUser(String email, String password) throws NotFoundException {

        User loginUser = userRepository.findByEmailAndPassword(email, password).orElseThrow(NotFoundException::new);

        return loginUser;
    }

    public void saveRefreshToken(String email, String refreshToken) throws NotFoundException {

        User user = userRepository.findByEmail(email).orElseThrow(NotFoundException::new);
        user.saveRefreshToken(refreshToken);
    }


    public User getRefreshToken(String email) throws NotFoundException {

        return userRepository.findByEmail(email).orElseThrow(NotFoundException::new);
    }


    public void deleteRefreshToken(String email) throws NotFoundException {
        User member = userRepository.findByEmail(email).orElseThrow(NotFoundException::new);
        log.debug("member : {} ", member);
        member.deleteRefreshToken();
    }
}
