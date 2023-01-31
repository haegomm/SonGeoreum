package com.bbb.pjtname.api.request;

import lombok.*;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FavoriteToggleReq {

    private String userId;

    private String wordId;

}
