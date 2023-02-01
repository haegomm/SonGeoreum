package com.bbb.pjtname.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class WordNotFoundException extends RuntimeException{

    public WordNotFoundException () {super("해당 단어를 찾을 수 없습니다.");}
    public WordNotFoundException (String msg) {super(msg);}
}
