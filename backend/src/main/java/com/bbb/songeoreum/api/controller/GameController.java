package com.bbb.songeoreum.api.controller;

import com.bbb.songeoreum.api.request.GameRemoveUserReq;
import com.bbb.songeoreum.api.response.EnterRoomRes;
import com.bbb.songeoreum.api.response.SuccessRes;
import com.bbb.songeoreum.api.service.GameService;
import com.bbb.songeoreum.db.domain.User;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

/**
 * {@code GameController}는 게임에 관련된 API를 처리하는 컨트롤러입니다.
 *
 * @author Youngmook-Lim
 * @version 1.0
 */
@Slf4j
@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
@Api(tags = {"게임 API"})
public class GameController {

    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";
    private final GameService gameService;

    /**
     * 유저가 OpenVidu session에 입장할때 사용하는 token을 반환합니다
     *
     * @param httpServletRequest 해당 유저의 User 객체 접근 용도 - Spring Security가 access token 인증을 통해 해당 유저의 User 객체를 httpServletRequest에 담습니다
     * @return Client가 특정 OpenVidu session에 입장할 수 있게 하는 token, 게임 시작 여부 playGame, 해당 session의 sessionId, 현재 연결된 유저 리스트를 {@code ResponseEntity}로 반환합니다
     * @throws OpenViduJavaClientException
     * @throws OpenViduHttpException
     */
    @ApiOperation(value = "게임 방 생성 및/또는 입장")
    @PostMapping("/session")
    public ResponseEntity<EnterRoomRes> enterRoom(HttpServletRequest httpServletRequest) throws OpenViduJavaClientException, OpenViduHttpException {

        User user = (User) httpServletRequest.getAttribute("user");

        HttpStatus httpStatus = null;
        EnterRoomRes enterRoomRes = null;

        // gameService의 큐 맨 앞에 있는 session에 connection 생성하고 반환
        enterRoomRes = gameService.enterRoom(user.getId());

        log.debug("Connection 성공");

        enterRoomRes.setMessage(SUCCESS);

        httpStatus = HttpStatus.OK;

        return new ResponseEntity<>(enterRoomRes, httpStatus);
    }

    /**
     * 대기방에서 유저가 나갈 시 해당 session에서 유저의 connection을 해제합니다
     *
     * @param gameRemoveUserReq 퇴장한 유저가 속했던 session의 sessionId
     * @return 성공 시 성공메시지를 {@code ResponseEntity}로 반환합니다
     * @throws OpenViduJavaClientException
     * @throws OpenViduHttpException
     */
    @ApiOperation(value = "대기중인 방에서 유저가 나갈 시 해당 세션에서 유저 connection 해제")
    @PostMapping("/session/user")
    public ResponseEntity<SuccessRes> removeUser(@Valid @RequestBody GameRemoveUserReq gameRemoveUserReq) throws OpenViduJavaClientException, OpenViduHttpException {

        gameService.removeUser(gameRemoveUserReq.getSessionId());

        HttpStatus httpStatus = HttpStatus.OK;
        SuccessRes successRes = SuccessRes.builder().message(SUCCESS).build();

        return new ResponseEntity<>(successRes, httpStatus);
    }

    /**
     * 게임을 종료시키고 게임방을 초기화합니다
     *
     * @param id session의 sessionId
     * @return 성공 시 성공메시지를 {@code ResponseEntity}로 반환합니다
     * @throws OpenViduJavaClientException
     * @throws OpenViduHttpException
     */
    @ApiOperation(value = "게임 종료 및 게임방 초기화")
    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<SuccessRes> exitRoom(@PathVariable("sessionId") String id) throws OpenViduJavaClientException, OpenViduHttpException {

        gameService.exitRoom(id);

        HttpStatus httpStatus = HttpStatus.OK;
        SuccessRes successRes = SuccessRes.builder().message(SUCCESS).build();

        return new ResponseEntity<>(successRes, httpStatus);
    }

    /**
     * 대기방에 있는 모든 유저들을 퇴출시키고 대기방을 초기화합니다
     *
     * @param id session의 sessionId
     * @return 성공 시 성공메시지를 {@code ResponseEntity}로 반환합니다
     * @throws OpenViduJavaClientException
     * @throws OpenViduHttpException
     */
    @ApiOperation(value = "대기방 초기화")
    @PutMapping("/session/{sessionId}")
    public ResponseEntity<SuccessRes> resetStandby(@PathVariable("sessionId") String id) throws OpenViduJavaClientException, OpenViduHttpException {

        gameService.resetStandby(id);

        HttpStatus httpStatus = HttpStatus.OK;
        SuccessRes successRes = SuccessRes.builder().message(SUCCESS).build();

        return new ResponseEntity<>(successRes, httpStatus);
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

    @ApiOperation(value = "개발용 : 정보 조회")
    @GetMapping("/info")
    public ResponseEntity<String> getInfo() {
        HttpStatus httpStatus = null;
        String message = null;

        try {
            gameService.getInfo();

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
