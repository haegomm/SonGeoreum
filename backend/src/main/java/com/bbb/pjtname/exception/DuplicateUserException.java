package com.bbb.pjtname.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class DuplicateUserException extends RuntimeException {
    public DuplicateUserException() {
        super("대기방에 이미 현 유저가 있습니다.");
    }

    public DuplicateUserException(String msg) {
        super(msg);
    }
}
