package com.bbb.pjtname.api.controller;

import com.bbb.pjtname.api.service.GameService;
import io.openvidu.java.client.Connection;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

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
    public ResponseEntity<Map<String, Object>> enterRoom() {

        Map<String, Object> resultMap = null;
        HttpStatus httpStatus = null;

        // gameService의 큐 맨 앞에 있는 session에 connection 생성하고 반환
        try {
            resultMap = gameService.enterRoom();
            Connection connection = (Connection) resultMap.get("connection");
            // 토큰 삽입
            resultMap.put("token", connection.getToken());
            resultMap.put("message", SUCCESS);
            httpStatus = HttpStatus.OK;
        } catch (Exception e) {
            resultMap = new HashMap<>();
            resultMap.put("message", FAIL);
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(resultMap, httpStatus);
    }
}
