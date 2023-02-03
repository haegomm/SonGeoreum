package com.bbb.songeoreum.db.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

////////////////////////////////////////////////////////////////////// 안쓰기로 함 ////////////////////////////////////

@Entity
@Getter
@AllArgsConstructor(access = AccessLevel.PROTECTED) //모든 필드 값을 파라미터로 받는 생성자를 만듦
@NoArgsConstructor(access = AccessLevel.PROTECTED) //기본생성자 생성
public class Session implements Serializable {

    //pk
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //Auto Increment 지원
    private Long id;

    //생성일시
    @Column(name = "creation_date")
    //@Temporal(TemporalType.TIMESTAMP)
    private String creationDate;

    //상태("OFF" : 존재하지 않는 방, "ON" : 입장 가능한 방, "GAME" : 게임 진행 중)
    @Column(length = 10)
    private String status;
}
