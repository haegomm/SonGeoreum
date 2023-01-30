package com.bbb.pjtname.db.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Getter //getter 생성
@AllArgsConstructor //모든 필드 값을 파라미터로 받는 생성자를 만듦
@NoArgsConstructor(access = AccessLevel.PROTECTED) //기본생성자 생성
public class Category implements Serializable {

    // PK
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //Auto Increment 지원
    private Long id;

    // 카테고리 이름
    @Column(length = 20, nullable = false)
    private String name;

    // 테스트 가능 여부 (Y/N)
    @Column(name = "is_testable", nullable = false)
    private Character isTestable;
}
