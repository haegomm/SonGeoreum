package com.bbb.pjtname.db.domain;

import com.bbb.pjtname.api.request.InsertUserReq;
import lombok.*;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Getter //getter 생성
@AllArgsConstructor(access = AccessLevel.PROTECTED) //모든 필드 값을 파라미터로 받는 생성자를 만듦
@NoArgsConstructor(access = AccessLevel.PROTECTED) //기본생성자 생성
public class User implements Serializable {

    //pk
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //Auto Increment 지원
    private Long id;

    //사용자 타입(G:일반, K:카카오톡)
    @Column(name = "user_type", nullable = false)
    private char userType;

    //이메일
    @Column(unique = true, length = 100)
    private String email;

    //카카오톡 아이디
    @Column(name = "kakao_id", nullable = true)
    private String kakaoId;

    //비밀번호
    @Column(length = 20)
    private String password;

    //닉네임
    @Column(nullable = false, length = 50)
    private String nickname;

    //프로필 사진
    private String picture;

    //refresh Token
    @Column(length = 200)
    private String refreshToken;

    //레벨
    private int level;

    //경험치
    private int experience;

    //참여 중인 게임방 번호
    //@ManyToOne(fetch = FetchType.LAZY)
    //@JoinColumn(name = "room_id")
    //private Room room;

    //회원가입
    @Builder
    public User(InsertUserReq insertUserReq){
        this.userType = insertUserReq.getUserType();
        this.email = insertUserReq.getEmail();
        this.password = insertUserReq.getPassword();
        this.nickname = insertUserReq.getNickname();
        this.picture = insertUserReq.getPicture();
    }

    public void saveRefreshToken(String refreshToken){
        this.refreshToken = refreshToken;
    }

    public void deleteRefreshToken(){
        this.refreshToken = null;
    }



}
