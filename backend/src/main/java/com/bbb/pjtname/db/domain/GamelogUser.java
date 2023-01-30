package com.bbb.pjtname.db.domain;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Getter //getter 생성
@Builder
@AllArgsConstructor //모든 필드 값을 파라미터로 받는 생성자를 만듦
@NoArgsConstructor(access = AccessLevel.PROTECTED) //기본생성자 생성
@Table(name = "gamelog_user")
public class GamelogUser implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gamelog_id", nullable = false)
    private Gamelog gamelog;


}
