package com.bbb.songeoreum.exception;

import com.bbb.songeoreum.api.response.ErrorRes;
import io.openvidu.java.client.OpenViduHttpException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Slf4j
@ControllerAdvice
public class ControllerExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ResponseBody
    public ErrorRes handleNotFoundException(NotFoundException e) {
        log.error(e.getMessage());
        return ErrorRes.make(e.getMessage());
    }

    @ExceptionHandler(DuplicateUserException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorRes handleDuplicateUserException(DuplicateUserException e) {
        log.error(e.getMessage());
        return ErrorRes.make(e.getMessage());
    }

    @ExceptionHandler(RoomOverflowException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public ErrorRes handleRoomOverflowException(RoomOverflowException e) {
        log.error(e.getMessage());
        return ErrorRes.make(e.getMessage());
    }

    @ExceptionHandler(NoConnectionError.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public ErrorRes handleNoConnectionError(NoConnectionError e) {
        log.error(e.getMessage());
        return ErrorRes.make(e.getMessage());
    }

    @ExceptionHandler(OpenViduHttpException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public ErrorRes handleOpenViduHttpException(OpenViduHttpException e) {
        log.error(e.getMessage());
        return ErrorRes.make(e.getMessage() + " : OpenVidu 관련 예외가 발생했습니다.");
    }

    @ExceptionHandler(WordNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ResponseBody
    public ErrorRes handleWordNotFoundException(WordNotFoundException e) {
        log.error(e.getMessage());
        return ErrorRes.make(e.getMessage());
    }

    @ExceptionHandler(UserNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ResponseBody
    public ErrorRes handleUserNotFoundException(UserNotFoundException e) {
        log.error(e.getMessage());
        return ErrorRes.make(e.getMessage());
    }

    @ExceptionHandler(DuplicateException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    @ResponseBody
    public ErrorRes handleDuplicateException(DuplicateException e){
        log.error(e.getMessage());
        return ErrorRes.make(e.getMessage());
    }

    @ExceptionHandler(UnAuthorizedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ResponseBody
    public ErrorRes handleUnAuthorizedException(UnAuthorizedException e){
        log.error(e.getMessage());
        return ErrorRes.make(e.getMessage());
    }

    @ExceptionHandler(TokenValidFailedException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public ErrorRes handleTokenValidFailedException(TokenValidFailedException e){
        log.error(e.getMessage());
        return ErrorRes.make(e.getMessage());
    }

}
