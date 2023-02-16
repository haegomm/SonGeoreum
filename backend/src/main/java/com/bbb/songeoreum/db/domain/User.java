package com.bbb.songeoreum.db.domain;

import com.bbb.songeoreum.api.request.InsertUserReq;
import com.bbb.songeoreum.api.request.UpdateUserReq;
import com.bbb.songeoreum.api.response.GetUserRes;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Slf4j
@ToString
@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User implements Serializable {

    // pk
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 사용자 타입(NORMAL:일반,  KAKAO:카카오톡)
    @Column(nullable = false, name = "user_type", length = 15)
    private String userType;

    // 일반 회원 아이디
    @Column(unique = true, length = 100)
    private String email;

    // 카카오톡 회원 아이디
    @Column(length = 100, name = "kakao_id")
    private String kakaoId;

    // 비밀번호
    @Column(length = 200)
    private String password;

    // 닉네임
    @Column(unique = true, nullable = false, length = 15)
    private String nickname;

    // 프로필 사진 URL
    @Column(length = 10000)
    private String picture;

    // refresh토큰
    @Column(length = 200, name = "refresh_token")
    private String refreshToken;

    // 레벨
    @Column(nullable = false)
    private int level;

    // 경험치
    @Column(nullable = false)
    private int experience;

    // 가입일시
    @Column(nullable = false, name = "created_date")
    private LocalDateTime createdDate;

    // spring security용 컬럼
    @Column(nullable = false, length = 15)
    private String role;

    // 일반 사용자 회원가입
    @Builder
    public User(InsertUserReq insertUserReq, LocalDateTime createDate, String password) {
        this.userType = insertUserReq.getUserType();
        this.email = insertUserReq.getEmail();
        this.password = password;
        this.nickname = insertUserReq.getNickname();
        this.picture = insertUserReq.getPicture();
        this.level = 1;
        this.experience = 0;
        this.createdDate = createDate;
        this.role = "ROLE_USER";
    }

    // 카카오 사용자 회원가입
    public User(String userType, String kakaoId, String nickname, LocalDateTime createdDate) {
        this.userType = userType;
        this.kakaoId = kakaoId;
        this.nickname = nickname;
        this.picture = "data:image/png;base64,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";
        this.level = 1;
        this.experience = 0;
        this.createdDate = createdDate;
        this.role = "ROLE_USER";
    }

    // 카카오 사용자 이메일 수정
    public void updateEmail(String email) {
        this.email = email;
    }

    // ***임시 생성자***
    public User(String userType, String nickname, int level, int experience, LocalDateTime createdDate, String role) {
        this.userType = userType;
        this.nickname = nickname;
        this.level = level;
        this.experience = experience;
        this.createdDate = createdDate;
        this.role = role;
    }

    public void saveRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public void deleteRefreshToken() {
        this.refreshToken = null;
    }

    // 회원 정보 조회
    public GetUserRes toDTO() {
        return new GetUserRes(id, userType, email, kakaoId, nickname, picture, level, experience);
    }

    // 프로필 수정
    public void updateUser(UpdateUserReq updateUserReq) {
        this.nickname = updateUserReq.getNickname();
        this.picture = updateUserReq.getPicture();
    }

    // 게임 결과 경험치 반영
    public void updateExperience(int level, int experience) {
        this.level = level;
        this.experience = experience;
    }

}
