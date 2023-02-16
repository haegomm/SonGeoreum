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
    @NotBlank
    @Size(min = 2, max = 6)
    private String nickname;

    // 프로필 사진 URL
    private String picture;

}
