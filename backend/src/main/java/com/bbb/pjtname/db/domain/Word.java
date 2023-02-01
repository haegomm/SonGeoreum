package com.bbb.pjtname.db.domain;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Getter //getter 생성
@AllArgsConstructor //모든 필드 값을 파라미터로 받는 생성자를 만듦
@NoArgsConstructor(access = AccessLevel.PROTECTED) //기본생성자 생성
@ToString
public class Word implements Serializable {

    // PK
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //Auto Increment 지원
    private Long id;

    // 카테고리 이름
    @Column(length = 20, nullable = false, unique = true)
    private String name;

    // content url
    @Column(length = 200, name = "content_url", nullable = false, unique = true)
    private String contentUrl;

    // FK - 카테고리
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
}
