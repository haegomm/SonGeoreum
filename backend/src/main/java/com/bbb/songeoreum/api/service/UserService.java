package com.bbb.songeoreum.api.service;

import com.bbb.songeoreum.api.request.InsertUserReq;
import com.bbb.songeoreum.api.request.UpdateUserReq;
import com.bbb.songeoreum.api.response.GetUserRes;
import com.bbb.songeoreum.api.response.UpdateExperienceRes;
import com.bbb.songeoreum.db.domain.User;
import com.bbb.songeoreum.db.repository.UserRepository;
import com.bbb.songeoreum.exception.DuplicateException;
import com.bbb.songeoreum.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
//@Transactional(readOnly = true)  // 트랜잭션 안에서만 데이터 변경하게 설정
public class UserService {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // 이메일 중복 체크
    public void duplicateEmail(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new DuplicateException("중복된 이메일입니다.");
        }
    }

    // 닉네임 중복 체크
    public void duplicateNickname(String nickname) {
        if (userRepository.findByNickname(nickname).isPresent()) {
            throw new DuplicateException("중복된 닉네임입니다.");
        }

    }

    // 회원가입
    @Transactional
    public void insertUser(InsertUserReq insertUserReq) {

        LocalDateTime createDate = LocalDateTime.now();

        // password 인코딩
        String password = bCryptPasswordEncoder.encode(insertUserReq.getPassword());

        User user = User.builder().insertUserReq(insertUserReq).createDate(createDate).password(password).build();

        // 이메일 중복 체크
        duplicateEmail(user.getEmail());

        // 닉네임 중복 체크
        duplicateNickname(user.getNickname());

        userRepository.save(user);
    }


    // 로그인
    public User loginUser(String email, String password) throws NotFoundException {

        User loginUser = userRepository.findByEmail(email).orElseThrow(NotFoundException::new);
        if (passwordEncoder.matches(password, loginUser.getPassword())) {
            return loginUser;
        } else {
            throw new NotFoundException("아이디 또는 비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
        }

    }

    @Transactional
    public void saveRefreshToken(Long id, String refreshToken) throws NotFoundException {

        User user = userRepository.findById(id).orElseThrow(NotFoundException::new);
        user.saveRefreshToken(refreshToken);
    }


    public User getRefreshToken(Long id) throws NotFoundException {

        return userRepository.findById(id).orElseThrow(NotFoundException::new);
    }


    @Transactional
    public void deleteRefreshToken(Long id) throws NotFoundException {
        User user = userRepository.findById(id).orElseThrow(NotFoundException::new);
        log.debug("deleteRefreshToken 요청한 user : {} ", user);
        user.deleteRefreshToken();
    }

    // 회원 정보 조회
    public GetUserRes getUser(Long id) throws NotFoundException {
        return userRepository.findById(id).orElseThrow(NotFoundException::new).toDTO();
    }

    // 프로필 수정
    @Transactional
    public void updateUser(UpdateUserReq updateUserReq, Long id) throws NotFoundException {
        // request에 들어있는 User 정보는 영속성에 등록되어 있지 않기 때문에 영속성에 등록 시키기 위해 한번 더 검색
        User realUser = userRepository.findById(id).get();
        realUser.updateUser(updateUserReq);
    }

    // 게임 결과 경험치 반영
    @Transactional
    public UpdateExperienceRes updateExperience(Long id, int experience) {

        User realUser = userRepository.findById(id).get();

        int level = 1;

        switch (experience / 10) {
            case 0:
                break;
            case 1:
                level = 2;
                break;
            case 2:
                level = 3;
                break;
            case 3:
                level = 4;
                break;
            case 4:
                level = 5;
                break;
            case 5:
                level = 6;
                break;
            case 6:
                level = 7;
                break;
            case 7:
                level = 8;
                break;
            case 8:
                level = 9;
                break;
            default:
                level = 10;
                break;
        }

        // 기존 경험치에 넘어온 경험치를 더해줌.
        int calculatedExperience = experience + realUser.getExperience();

        realUser.updateExperience(level, calculatedExperience);

        UpdateExperienceRes updateExperienceRes = UpdateExperienceRes.builder().level(level).experience(experience).build();

        return updateExperienceRes;

    }

}
