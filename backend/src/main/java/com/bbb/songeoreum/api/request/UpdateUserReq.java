package com.bbb.songeoreum.api.request;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class UpdateUserReq {

    // 닉네임
    @NotBlank // Null, 빈 문자열, 스페이스만 있는 문자열 불가
    @Size(min = 2, max = 6)
    private String nickname;

    // 프로필 사진 URL
    private String picture;

}
