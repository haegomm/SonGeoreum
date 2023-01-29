package com.bbb.pjtname.db.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter //getter 생성
@AllArgsConstructor //모든 필드 값을 파라미터로 받는 생성자를 만듦
@NoArgsConstructor(access = AccessLevel.PROTECTED) //기본생성자 생성
public class Word {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //Auto Increment 지원
    private Long id;

    @Column(length = 20, nullable = false)
    private String name;

    @Column(length = 200, name = "content_url", nullable = false)
    private String contentUrl;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
}
