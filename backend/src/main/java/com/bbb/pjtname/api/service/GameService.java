package com.bbb.pjtname.api.service;

import com.bbb.pjtname.api.request.GameRemoveUserReq;
import com.bbb.pjtname.db.domain.Gamelog;
import com.bbb.pjtname.db.domain.GamelogUser;
import com.bbb.pjtname.db.domain.User;
import com.bbb.pjtname.db.repository.GamelogRepository;
import com.bbb.pjtname.db.repository.GamelogUserRepository;
import com.bbb.pjtname.db.repository.UserRepository;
import com.bbb.pjtname.exception.NoConnectionError;
import com.bbb.pjtname.exception.NotFoundException;
import com.bbb.pjtname.exception.RoomOverflowException;
import io.openvidu.java.client.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.time.LocalDateTime;
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
    private final UserRepository userRepository;

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
    private Map<String, Map<String, Object>> gameRooms;

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

    public Map<String, Object> enterRoom(Long userId) throws OpenViduJavaClientException, OpenViduHttpException {

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
        String sessionId = availableSession.getSessionId();
        int connectedPlayersCnt = availableSession.getActiveConnections().size();

        // 비정상적인 코드일때 처리 또는 throw exception
        if (connectedPlayersCnt == ROOM_SIZE) {
            toGameRooms(sessionId);
            availableSession = standbyRooms.peek();
        } else if (connectedPlayersCnt > ROOM_SIZE) {
            throw new RoomOverflowException();
        }

        // connection의 params 만들기 : 해당 connection에 연결되는 유저의 ID값 저장
        ConnectionProperties connectionProperties = new ConnectionProperties.Builder()
                .data(userId.toString())
                .build();

        // 큐의 맨 앞에 있는 대기방의 참가자 수가 4 미만일 경우 connection 생성
        connection = availableSession.createConnection(connectionProperties);

        if (connection == null) {
            throw new NoConnectionError();
        }

        // 정원 완료 시 게임방으로 세션 이동하고 playGame을 true로 세팅
        if (connectedPlayersCnt == ROOM_SIZE) {
            toGameRooms(sessionId);
            playGame = true;
        }

        // 재확인 : 대기방 갯수가 REDZONE 밑으로 떨어졌을 경우 대기방 갯수 추가
        if (standbyRooms.size() < POOL_REDZONE_NO) {
            increaseRoomBuffer();
        }

        // 반환값 세팅
        resultMap.put("token", connection.getToken());
        resultMap.put("playGame", playGame);
        resultMap.put("sessionId", sessionId);

        return resultMap;
    }

    public int exitRoom(String id) {
        // 성공 시 0, 실패 시 1 반환
        try {
            Map<String, Object> sessionInfo = gameRooms.get(id);

            Session session = (Session) sessionInfo.get("session");


            if (session == null) {
                throw new NotFoundException("세션을 찾을 수 없습니다.");
            }

            // DB 저장 //////////////////////////////////////
            // DB에 게임 로그(gamelog) 데이터 저장

            LocalDateTime startDate = (LocalDateTime) sessionInfo.get("startDate");
            LocalDateTime endDate = LocalDateTime.now();
            String sessionId = session.getSessionId();

            Gamelog gamelog = Gamelog.builder()
                    .startDate(startDate)
                    .endDate(endDate)
                    .sessionId(sessionId)
                    .build();

            gamelogRepository.save(gamelog);

            // DB에 로그-회원(gamelog_user) 데이터 저장

            for (Connection c : session.getConnections()) {
                // enterRoom 메서드에서 지정한 ConnectionProperties의 data 속성값 갖고오기
                Long userId = Long.parseLong(c.getClientData());
                User user = userRepository.findById(userId).orElseThrow(NotFoundException::new);

                GamelogUser gamelogUser = GamelogUser.builder()
                        .user(user)
                        .gamelog(gamelog)
                        .build();

                gamelogUserRepository.save(gamelogUser);
            }

            // 해당 세션에 연결된 모든 connection 퇴출
            session.close();

            // Plan B : 위에꺼가 session을 아예 삭제해버리면 아래 코드 사용
//            for (Connection c : session.getConnections()) {
//                session.forceDisconnect(c);
//            }

            // 빈 세션을 HashMap에서 빼고 큐로 넣기
            gameRooms.remove(id);
            standbyRooms.add(session);

            return 0;
        } catch (Exception e) {
            log.error(e.getMessage());
            return 1;
        }

    }

    public int removeUser(GameRemoveUserReq gameRemoveUserReq) {
        // 성공 시 0, 실패 시 1 반환
        try {
            String sessionId = gameRemoveUserReq.getSessionId();
            String connectionId = gameRemoveUserReq.getConnectionId();
            Session standbySession = standbyRooms.peek();

            if (!sessionId.equals(standbySession.getSessionId())) {
                throw new NotFoundException("세션이 일치하지 않습니다");
            }

            // 해당 connection의 연결 해제
            standbySession.forceDisconnect(connectionId);

            return 0;

        } catch (Exception e) {
            log.error(e.getMessage());
            return 1;
        }
    }

    public void increaseRoomBuffer() throws OpenViduJavaClientException, OpenViduHttpException {
        for (int i = 0; i < POOL_ADDITION_NO; i++) {
            Session session = openVidu.createSession();
            standbyRooms.add(session);
        }
    }

    public void toGameRooms(String sessionId) {
        Map<String, Object> sessionInfo = new ConcurrentHashMap<>();
        Session session = standbyRooms.poll();
        LocalDateTime startDate = LocalDateTime.now();
        sessionInfo.put("session", session);
        sessionInfo.put("startDate", startDate);
        gameRooms.put(sessionId, sessionInfo);
    }
}
