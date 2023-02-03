package com.bbb.songeoreum.api.controller;

import com.bbb.songeoreum.api.request.GameRemoveUserReq;
import com.bbb.songeoreum.api.request.UserIdReq;
import com.bbb.songeoreum.api.response.EnterRoomRes;
import com.bbb.songeoreum.api.response.ExitRoomRes;
import com.bbb.songeoreum.api.response.RemoveUserRes;
import com.bbb.songeoreum.api.response.ResetStandbyRes;
import com.bbb.songeoreum.api.service.GameService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Slf4j
@RestController
@RequestMapping("/game")
@RequiredArgsConstructor
@Api(tags = {"게임 API"}) // Swagger에 보여줄 명칭
public class GameController {

    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";
    private final GameService gameService;

    // OpenVidu 세션(방) 생성 및/또는 입장
    @ApiOperation(value = "게임 방 생성 및/또는 입장")
    @PostMapping("/session")
    public ResponseEntity<EnterRoomRes> enterRoom(@Valid @RequestBody UserIdReq userIdReq) {

        HttpStatus httpStatus = null;
        EnterRoomRes enterRoomRes = null;

        // gameService의 큐 맨 앞에 있는 session에 connection 생성하고 반환
        try {
            enterRoomRes = gameService.enterRoom(userIdReq.getId());

            log.debug("Connection 성공");

            enterRoomRes.setMessage(SUCCESS);

            httpStatus = HttpStatus.OK;
        } catch (Exception e) {
            log.error(e.getMessage());

            enterRoomRes = EnterRoomRes.builder().message(FAIL).build();

            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(enterRoomRes, httpStatus);
    }

    // 대기중인 방에서 유저가 나갈 시 해당 세션에서 유저 connection 해제
    @ApiOperation(value = "대기중인 방에서 유저가 나갈 시 해당 세션에서 유저 connection 해제")
    @PutMapping("/session/user")
    public ResponseEntity<RemoveUserRes> removeUser(@Valid @RequestBody GameRemoveUserReq gameRemoveUserReq) {

        HttpStatus httpStatus = null;
        RemoveUserRes removeUserRes = null;

        log.debug("이건 gameRemoveUserReq == {}", gameRemoveUserReq);

        int result = gameService.removeUser(gameRemoveUserReq);

        if (result == 0) {
            httpStatus = HttpStatus.OK;
            removeUserRes = RemoveUserRes.builder().msg(SUCCESS).build();
        } else {
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
            removeUserRes = RemoveUserRes.builder().msg(FAIL).build();
        }

        return new ResponseEntity<>(removeUserRes, httpStatus);
    }

    // 게임 종료 및 게임방 초기화 
    @ApiOperation(value = "게임 종료 및 게임방 초기화")
    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<ExitRoomRes> exitRoom(@PathVariable("sessionId") String id) {

        HttpStatus httpStatus = null;
        ExitRoomRes exitRoomRes = null;

        int result = gameService.exitRoom(id);

        if (result == 0) {
            httpStatus = HttpStatus.OK;
            exitRoomRes = ExitRoomRes.builder().msg(SUCCESS).build();

        } else {
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
            exitRoomRes = ExitRoomRes.builder().msg(FAIL).build();

        }

        return new ResponseEntity<>(exitRoomRes, httpStatus);
    }

    // 대기방 초기화
    @ApiOperation(value = "대기방 초기화")
    @PutMapping("/session/{sessionId}")
    public ResponseEntity<ResetStandbyRes> resetStandby(@PathVariable("sessionId") String id) {

        HttpStatus httpStatus = null;
        ResetStandbyRes resetStandbyRes = null;

        int result = gameService.resetStandby(id);

        if (result == 0) {
            httpStatus = HttpStatus.OK;
            resetStandbyRes = ResetStandbyRes.builder().msg(SUCCESS).build();

        } else {
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
            resetStandbyRes = ResetStandbyRes.builder().msg(FAIL).build();

        }

        return new ResponseEntity<>(resetStandbyRes, httpStatus);
    }

    @ApiOperation(value = "개발용 : 게임 중인 방 모두 초기화")
    @DeleteMapping("/reset")
    public ResponseEntity<String> resetRooms() {

        HttpStatus httpStatus = null;
        String message = null;

        try {
            gameService.resetRooms();

            message = SUCCESS;

            httpStatus = HttpStatus.OK;
        } catch (Exception e) {
            log.error(e.getMessage());

            message = FAIL;

            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(message, httpStatus);
    }
}
