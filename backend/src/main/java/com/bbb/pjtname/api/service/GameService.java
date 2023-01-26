package com.bbb.pjtname.api.service;

import com.bbb.pjtname.api.request.GameRemoveUserReq;
import com.bbb.pjtname.db.repository.GamelogRepository;
import com.bbb.pjtname.db.repository.GamelogUserRepository;
import com.bbb.pjtname.exception.RoomOverflowException;
import io.openvidu.java.client.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

@Slf4j
@Service
@RequiredArgsConstructor
public class GameService {
    private final GamelogRepository gamelogRepository;
    private final GamelogUserRepository gamelogUserRepository;

    // OpenVidu 서버 URL 및 암호키(BBB) 설정 (application.properties에서 가져옴)
    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;
    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    // OpenVidu 객체 (session, connection 생성 용도)
    private OpenVidu openVidu;

    // 대기방 큐
    private Queue<Session> standbyRooms;

    // 게임중인 방
    private Map<String, Session> gameRooms;

    ////////// 방 생성 관련 상수 변수 //////////
    // 최초 생성 방 갯수 (pool)
    private static final int INITIAL_ROOM_NO = 10;
    // 현재 대기방이 최초 방 갯수 대비 특정 비율(REDZONE) 하락했을 경우
    // 대기 pool에 방을 추가해준다
    private static final double POOL_REDZONE_RATIO = 0.5;
    private static final int POOL_REDZONE_NO = (int) (INITIAL_ROOM_NO * POOL_REDZONE_RATIO);

    // 대기방 갯수가 특정 비율 이상 하락했을 시 추가해주는 방 갯수
    private static final double POOL_ADDITION_RATIO = 0.3;
    private static final int POOL_ADDITION_NO = (int) (INITIAL_ROOM_NO * POOL_ADDITION_RATIO);
    private static final int ROOM_SIZE = 4;

    @PostConstruct
    public void init() throws OpenViduJavaClientException, OpenViduHttpException {
        // OpenVidu 객체 초기화 (WAS 띄우고 한번만 실행 (@PostConstruct))
        this.openVidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);

        // 대기방 큐 초기화
        // 큐는 멀티 스레드 환경을 반영하여 ConcurrentLinkedQueue를 활용
        standbyRooms = new ConcurrentLinkedQueue<>();

        // 최초 방 갯수만큼 Session 생성 + 큐에 추가
        for (int i = 0; i < INITIAL_ROOM_NO; i++) {
            Session session = openVidu.createSession();
            standbyRooms.add(session);
        }

        // 해시맵은 멀티 스레드 환경을 반영하여 ConcurrentHashMap을 활용
        gameRooms = new ConcurrentHashMap<>();
    }

    public Map<String, Object> enterRoom() throws OpenViduJavaClientException, OpenViduHttpException {

        Connection connection = null;
        String token = null;
        boolean playGame = false;
        Map<String, Object> resultMap = new HashMap<>();

        // 대기방 갯수가 REDZONE 밑으로 떨어졌을 경우 대기방 갯수 추가
        if (standbyRooms.size() < POOL_REDZONE_NO) {
            increaseRoomBuffer();
        }

        // 큐의 맨 앞 대기방(여기에 참가자 차곡차곡 채워넣을 것)
        Session availableSession = standbyRooms.peek();

        // 큐의 맨 앞에 있는 대기방의 참가자 수가 4 미만일 경우 connection 생성
        // 코드가 정상적으로 돌아갈 경우 4 이상일 경우는 없긴 함
        int connectedPlayersCnt = availableSession.getActiveConnections().size();
        if (connectedPlayersCnt == ROOM_SIZE) {
            toGameRooms(availableSession.getSessionId());
            availableSession = standbyRooms.peek();
        } else if (connectedPlayersCnt > ROOM_SIZE) {
            throw new RoomOverflowException();
        }
        connection = availableSession.createConnection();

        // 정원 완료 시 게임방으로 세션 이동하고 playGame을 true로 세팅
        if (connectedPlayersCnt == ROOM_SIZE) {
            toGameRooms(availableSession.getSessionId());
            playGame = true;
        }

        // 재확인 : 대기방 갯수가 REDZONE 밑으로 떨어졌을 경우 대기방 갯수 추가
        if (standbyRooms.size() < POOL_REDZONE_NO) {
            increaseRoomBuffer();
        }

        // 반환값 세팅
        resultMap.put("token", connection.getToken());
        resultMap.put("playGame", playGame);
        
        return resultMap;
    }

    public int exitRoom(String id) {
        // 성공 시 0, 실패 시 1 반환
        return 0;
    }

    public int removeUser(GameRemoveUserReq gameRemoveUserReq) {
        // 성공 시 0, 실패 시 1 반환
        return 0;
    }

    public void increaseRoomBuffer() throws OpenViduJavaClientException, OpenViduHttpException {
        for (int i = 0; i < POOL_ADDITION_NO; i++) {
            Session session = openVidu.createSession();
            standbyRooms.add(session);
        }
    }

    public void toGameRooms(String sessionId) {
        Session session = standbyRooms.poll();
        gameRooms.put(sessionId, session);
    }
}
