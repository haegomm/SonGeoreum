package com.bbb.pjtname.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class NoConnectionError extends RuntimeException {
    public NoConnectionError() {
        super("해당 session의 connection 생성에 실패하였습니다.");
    }

    public NoConnectionError(String msg) {
        super(msg);
    }
}
