package com.bbb.songeoreum.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class RoomOverflowException extends RuntimeException {
    public RoomOverflowException() {
        super("해당 방의 인원한도를 초과하였습니다.");
    }

    public RoomOverflowException(String msg) {
        super(msg);
    }
}
