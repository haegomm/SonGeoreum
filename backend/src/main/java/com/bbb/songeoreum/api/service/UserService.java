package com.bbb.songeoreum.api.service;

import com.bbb.songeoreum.api.request.InsertUserReq;
import com.bbb.songeoreum.api.request.UpdateUserReq;
import com.bbb.songeoreum.api.response.GetTopTenUserRes;
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
import java.util.List;
import java.util.stream.Collectors;

/**
 * {@code UserService}는 일반 사용자 관련 로직을 처리하는 서비스입니다.
 *
 * @author wjdwn03
 * @version 1.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final PasswordEncoder passwordEncoder;

    /**
     * 요청 온 이메일을 DB에서 중복체크하여 중복된 경우에만 DuplicateException을 throw 합니다.
     * @param email 중복체크 요청한 이메일
     * @throws DuplicateException
     */
    public void duplicateEmail(String email) throws DuplicateException {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new DuplicateException("중복된 이메일입니다.");
        }
    }

    /**
     * 요청 온 닉네임을 DB에서 중복체크하여 중복된 경우에만 DuplicateException을 throw 합니다.
     * @param nickname 중복체크 요청한 닉네임
     * @throws DuplicateException
     */
    public void duplicateNickname(String nickname) throws DuplicateException {
        if (userRepository.findByNickname(nickname).isPresent()) {
            throw new DuplicateException("중복된 닉네임입니다.");
        }

    }

    /**
     * DB에 사용자 정보를 저장합니다.
     * @param insertUserReq 회원 가입 form에 사용자가 입력한 정보
     * @throws DuplicateException
     */
    @Transactional
    public void insertUser(InsertUserReq insertUserReq) throws DuplicateException {

        LocalDateTime createDate = LocalDateTime.now();

        String password = bCryptPasswordEncoder.encode(insertUserReq.getPassword());

        User user = User.builder().insertUserReq(insertUserReq).createDate(createDate).password(password).build();

        duplicateEmail(user.getEmail());

        duplicateNickname(user.getNickname());

        userRepository.save(user);
    }

    /**
     * 로그인 요청한 정보와 DB에 저장된 정보가 일치하는지 확인합니다.
     * @param email 사용자가 입력한 이메일
     * @param password 사용자가 입력한 비밀번호
     * @return 성공 시 해당 사용자의 정보 중 화면에 상시 노출되어야 하는 정보를 User 객체로 반환합니다.
     * @throws NotFoundException
     */
    public User loginUser(String email, String password) throws NotFoundException {

        User loginUser = userRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("아이디 또는 비밀번호가 일치하지 않습니다. 다시 확인해주세요."));
        if (passwordEncoder.matches(password, loginUser.getPassword())) {
            return loginUser;
        } else {
            throw new NotFoundException("아이디 또는 비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
        }

    }

    /**
     * 발급된 refresh token을 DB에 저장합니다.
     * @param id refresh token을 저장할 사용자의 id(user table PK)
     * @param refreshToken DB에 저장할 refresh token
     * @throws NotFoundException
     */
    @Transactional
    public void saveRefreshToken(Long id, String refreshToken) throws NotFoundException {

        User user = userRepository.findById(id).orElseThrow(NotFoundException::new);
        user.saveRefreshToken(refreshToken);
    }

    /**
     * 로그아웃 시 호출되는 메서드로 DB에 저장된 refresh token을 삭제합니다.
     * @param id refresh token을 삭제할 id(user table PK)
     * @throws NotFoundException
     */
    @Transactional
    public void deleteRefreshToken(Long id) throws NotFoundException {
        User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException("존재하지 않는 user 입니다."));
        user.deleteRefreshToken();
    }

    /**
     * 파라미터로 넘어온 id에 해당하는 사용자의 정보를 반환합니다.
     * @param id DB에서 정보를 조회할 id(user table PK)
     * @return 요청 들어온 사용자의 정보를 담은 GetUserRes DTO
     * @throws NotFoundException
     */
    public GetUserRes getUser(Long id) throws NotFoundException {
        return userRepository.findById(id).orElseThrow(NotFoundException::new).toDTO();
    }

    /**
     * 프로필 수정을 요청한 정보를 DB에 저장합니다.
     * 이때 request에 들어있는 User 정보는 영속성에 등록되어 있지 않기 때문에 영속성에 등록시키기 위해 한 번 더 검색합니다.
     * 닉네임을 수정하지 않은 경우 원래 본인이 쓰던 닉네임이 넘어올 것이므로 중복 체크를 하지 않습니다.
     * @param updateUserReq 수정할 닉네임, 프로필 사진
     * @param id 프로필 수정할 id(user table PK)
     * @throws NotFoundException
     * @throws DuplicateException
     */
    @Transactional
    public void updateUser(UpdateUserReq updateUserReq, Long id) throws NotFoundException, DuplicateException {

        User realUser = userRepository.findById(id).orElseThrow(() -> new NotFoundException("존재하지 않는 user 입니다."));

        if (!updateUserReq.getNickname().equals(realUser.getNickname())) {

            duplicateNickname(updateUserReq.getNickname());

        }
        realUser.updateUser(updateUserReq);
    }

    /**
     * 게임, 테스트 결과 획득한 경험치를 DB에 저장합니다.
     * @param id 경험치를 저장할 id(user table PK)
     * @param experience 게임, 테스트에서 획득한 경험치
     * @return 파라미터로 넘어온 경험치를 반영한 UpdateExperienceRes DTO로 반환합니다.
     */
    @Transactional
    public UpdateExperienceRes updateExperience(Long id, int experience) {

        User realUser = userRepository.findById(id).get();

        int calculatedExperience = experience + realUser.getExperience();

        int level = Math.min(calculatedExperience / 10 + 1, 10);


        realUser.updateExperience(level, calculatedExperience);

        UpdateExperienceRes updateExperienceRes = UpdateExperienceRes.builder().level(level).experience(experience).build();

        return updateExperienceRes;

    }

    /**
     * 경험치를 기준으로 상위 10명의 리스트를 반환합니다.
     * @return 상위 10명을 GetTopTenUserRes DTO로 담은 List
     * @throws NotFoundException
     */
    public List<GetTopTenUserRes> getTopTenUser() throws NotFoundException {
        return userRepository.findTop10ByOrderByExperienceDesc().stream().map(user -> GetTopTenUserRes.builder().user(user).build()).collect(Collectors.toList());
    }

}
