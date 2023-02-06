package com.bbb.songeoreum.api.service;

import com.bbb.songeoreum.api.request.GameRemoveUserReq;
import com.bbb.songeoreum.api.response.EnterRoomRes;
import com.bbb.songeoreum.db.domain.Gamelog;
import com.bbb.songeoreum.db.domain.GamelogUser;
import com.bbb.songeoreum.db.domain.User;
import com.bbb.songeoreum.db.repository.GamelogRepository;
import com.bbb.songeoreum.db.repository.GamelogUserRepository;
import com.bbb.songeoreum.db.repository.UserRepository;
import com.bbb.songeoreum.exception.DuplicateUserException;
import com.bbb.songeoreum.exception.NoConnectionError;
import com.bbb.songeoreum.exception.NotFoundException;
import com.bbb.songeoreum.exception.RoomOverflowException;
import io.openvidu.java.client.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class GameService {
    private final GamelogRepository gamelogRepository;
    private final GamelogUserRepository gamelogUserRepository;
    private final UserRepository userRepository;

    // OpenVidu 서버 URL 및 암호키(BBB) 설정 (application.yml에서 가져옴)
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

    ////////// 방 생성 관련 변수 //////////
    // 최초 생성 방 갯수 (pool)
    private static final int INITIAL_ROOM_NO = 10;

    // 현재 진행 중인 게임에 비례한 multiplier
    // 용도 : 진행중이 게임이 많을 수록(그만큼 바쁘다는 뜻) 밑에 REDZONE이 높아지고
    // REDZONE 도달 시 추가되는 대기방 갯수도 많아진다
    // 기본값은 1;
    private int multiplier = 1;

    // 현재 대기방이 최초 방 갯수 대비 특정 비율(REDZONE) 하락했을 경우
    // 대기 pool에 방을 추가해준다
    private static final double POOL_REDZONE_RATIO = 0.5;
    private int poolRedzoneNo = (int) (INITIAL_ROOM_NO * POOL_REDZONE_RATIO * multiplier);

    // 대기방 갯수가 특정 비율 이상 하락했을 시 추가해주는 방 갯수
    private static final double POOL_ADDITION_RATIO = 0.3;
    private int poolAdditionNo = (int) (INITIAL_ROOM_NO * POOL_ADDITION_RATIO * multiplier);
    private static final int ROOM_SIZE = 4;
    private static final int MAX_GAME_TIME_MINUTES = 20;
    private static final int GC_INTERVAL_MINUTES = 5;

    @PostConstruct
    public void initialSetup() throws OpenViduJavaClientException, OpenViduHttpException {
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

        // 방 갯수 초기화
//        multiplier = INITIAL_ROOM_NO;
        calculateMultiplierAndUpdate();
    }

    // multiplier 계산 로직
    public void calculateMultiplierAndUpdate() {
        int gameRoomCnt = gameRooms.size();

        // 최초 대기방 수 대비 현재 게임방 수에 따라 multiplier 설정
        multiplier = gameRoomCnt / INITIAL_ROOM_NO + 1;

        // REDZONE 값, 대기 큐 추가 방 갯수 값 수정
        poolRedzoneNo = (int) (INITIAL_ROOM_NO * POOL_REDZONE_RATIO * multiplier);
        poolAdditionNo = (int) (INITIAL_ROOM_NO * POOL_ADDITION_RATIO * multiplier);

    }

    // 주기적으로 자동적으로 호출됨
    // gameRooms 순회하며 비정상적으로 오래 살아있는 게임방 초기화 작업 (예: 20분이 넘어갔는데 안 끝난 게임)
    @Scheduled(fixedRate = GC_INTERVAL_MINUTES * 60000)
    public void garbageCollector() throws OpenViduJavaClientException, OpenViduHttpException {
        log.debug("Session Garbage Collector 출동");

        // 대기방 정리 (앞에서부터 정상 세션 나올때까지만 작동)
        checkActiveSessionAndUpdate();

        // 게임방 정리
        for (String id : gameRooms.keySet()) {
            Map<String, Object> sessionInfo = gameRooms.get(id);
            LocalDateTime startDate = (LocalDateTime) sessionInfo.get("startDate");
            Duration duration = Duration.between(startDate, LocalDateTime.now());
            log.debug("게임 시작 후 지난 시간(분) : {}", duration.toMinutes());
            if (duration.toMinutes() >= MAX_GAME_TIME_MINUTES) {
                clearRoom(id, (Session) sessionInfo.get("session"));
                log.debug("세션 {} gameRooms에서 퇴출", id);
            }
        }
    }

    public Session checkActiveSessionAndUpdate() throws OpenViduJavaClientException, OpenViduHttpException {
        Session returnSession = null;
        while (!standbyRooms.isEmpty()) {
            try {
                returnSession = standbyRooms.peek();
                // 세션이 닫혀있으면 여기서 에러날꺼임
                returnSession.fetch();
                return returnSession;
            } catch (Exception e) {
                // 위에서 에러났다는 뜻은 못쓰는 세션이라는 뜻, 버려주세요~
                standbyRooms.poll();
                // 대기방 갯수가 REDZONE 밑으로 떨어졌을 경우 대기방 갯수 추가
                if (standbyRooms.size() < poolRedzoneNo) {
                    increaseRoomBuffer();
                }
            }
        }
        // 아래 코드까지 사실 가면 안됨, 위에서 increaseRoomBuffer을 해주기 때문
        increaseRoomBuffer();
        return standbyRooms.peek();
    }

    public EnterRoomRes enterRoom(Long userId) throws OpenViduJavaClientException, OpenViduHttpException {

        // 큐의 맨 앞 대기방(여기에 참가자 차곡차곡 채워넣을 것)
        Session availableSession = null;

        // 쓸 수 있는 세션 찾을때까지 돈다
        availableSession = checkActiveSessionAndUpdate();

        String sessionId = availableSession.getSessionId();

        // 실제 사용용
//        int connectedPlayersCnt = availableSession.getActiveConnections().size();

        // POSTMAN 테스트 용 : 실제로 사용할때는 프론트가 연결을 해주면서 active connection이 생성되고
        // active connection 기준으로 모든걸 계산해야 하는게 맞지만
        // POSTMAN으로 테스트 할 시 프론트가 연결을 해주는게 아니므로 active connection이 아닌 것들까지 포함한
        // getConnections()를 활용하여 로직 테스트
        int connectedPlayersCnt = availableSession.getConnections().size();

        // 현재 대기방에 중복되는 유저 있는지 확인
        for (Connection c : availableSession.getActiveConnections()) {
            Long cId = Long.parseLong(c.getServerData());
            if (userId.equals(cId)) {
                throw new DuplicateUserException();
            }
        }

        // 존재하는 유저인지 확인
        if (!userRepository.findById(userId).isPresent()) {
            throw new NotFoundException("해당 유저를 찾을 수 없습니다.");
        }

        Connection connection = null;
        String token = null;
        boolean playGame = false;
        EnterRoomRes enterRoomRes = null;


        // 대기방 갯수가 REDZONE 밑으로 떨어졌을 경우 대기방 갯수 추가
        if (standbyRooms.size() < poolRedzoneNo) {
            increaseRoomBuffer();
        }

        // 비정상적인 코드일때 처리 또는 throw exception
        if (connectedPlayersCnt == ROOM_SIZE) {
            toGameRooms(sessionId);
            availableSession = checkActiveSessionAndUpdate();
        } else if (connectedPlayersCnt > ROOM_SIZE) {
            throw new RoomOverflowException();
        }

        // connection의 params 만들기 : 해당 connection에 연결되는 유저의 ID값 저장
        ConnectionProperties connectionProperties = new ConnectionProperties.Builder()
                .data(userId.toString())
                .build();

        // 큐의 맨 앞에 있는 대기방의 참가자 수가 4 미만일 경우 connection 생성
        try {
            connection = availableSession.createConnection(connectionProperties);
        } catch (Exception e) {
            // checkActiveSessionAndUpdate에서 열려있는 세션을 보장했지 때문에 아래 에러는 뜨면 안됨
            throw new NoConnectionError();
        }

        connectedPlayersCnt++;
//        log.debug(String.valueOf(connectedPlayersCnt));

        // 정원 완료 시 게임방으로 세션 이동하고 playGame을 true로 세팅
        if (connectedPlayersCnt == ROOM_SIZE) {
            toGameRooms(sessionId);
            playGame = true;
        }

        // 재확인 : 대기방 갯수가 REDZONE 밑으로 떨어졌을 경우 대기방 갯수 추가
        if (standbyRooms.size() < poolRedzoneNo) {
            increaseRoomBuffer();
        }

        enterRoomRes = EnterRoomRes.builder()
                .token(connection.getToken())
                .playGame(playGame)
                .sessionId(sessionId)
                .playersList(new ArrayList<>()).build();

        for (Connection c : availableSession.getActiveConnections()) {
            Long cId = Long.parseLong(c.getServerData());
            enterRoomRes.getPlayersList().add(cId);
        }
        enterRoomRes.getPlayersList().add(userId);

        log.debug("standbyRoom : {}", standbyRooms.peek().getActiveConnections().toString());
        log.debug("playersList : {}", enterRoomRes.getPlayersList().toString());
        log.debug("gameRooms : {}", gameRooms.toString());
        log.debug("gameRooms count : {}", gameRooms.size());
        log.debug("standbyRooms count : {}", standbyRooms.size());
        log.debug("connected players count : {}", connectedPlayersCnt);
        log.debug("multiplier : {}", multiplier);


        return enterRoomRes;
    }

    @Transactional
    public int exitRoom(String id) {
        // 성공 시 0, 실패 시 1 반환
        try {
            Map<String, Object> sessionInfo = gameRooms.get(id);
            Session session;
            try {
                session = (Session) sessionInfo.get("session");
            } catch (Exception e) {
                log.error(e.getMessage());
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

            for (Connection c : session.getActiveConnections()) {
                // enterRoom 메서드에서 지정한 ConnectionProperties의 data 속성값 갖고오기
                Long userId = Long.parseLong(c.getServerData());
                User user = userRepository.findById(userId).orElseThrow(NotFoundException::new);

                GamelogUser gamelogUser = GamelogUser.builder()
                        .user(user)
                        .gamelog(gamelog)
                        .build();

                gamelogUserRepository.save(gamelogUser);
            }

            // 해당 세션에 연결된 모든 connection 퇴출하고 빈 세션을 gameRooms에서 제거
            clearRoom(id, session);

            log.debug("gameRooms : {}", gameRooms.toString());
            log.debug("standbyRooms size : {}", standbyRooms.size());

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
//            String connectionId = gameRemoveUserReq.getConnectionId();
            Session standbySession = standbyRooms.peek();

            if (!sessionId.equals(standbySession.getSessionId())) {
                throw new NotFoundException("세션이 일치하지 않습니다");
            }

            // 유저가 대기방에 있는지 확인
//            boolean flag = false;
//
//            for (Connection c : standbySession.getActiveConnections()) {
//                if (c.getConnectionId().equals(connectionId)) {
//                    flag = true;
//                    break;
//                }
//            }
//
//            if (!flag) {
//                throw new UserNotFoundException("해당 유저는 대기방에 없습니다.");
//            }

//            int noOfActiveConnectionsBeforeDisconnect = standbySession.getActiveConnections().size();

            // 해당 connection의 연결 해제
//            standbySession.forceDisconnect(connectionId);

            int noOfActiveConnectionsAfterDisconnect = standbySession.getActiveConnections().size();

            // 유저 퇴출 전 active connections가 1 이상이었고 지금 active connections 가 없을때
            // 어차피 세션 자동으로 닫히니까 버리겠소 (OpenVidu가 마지막 active connection 닫히는 순간 세션 종료시켜 버리기 때문)
            if (noOfActiveConnectionsAfterDisconnect == 0) {
                standbyRooms.poll();
            }

            return 0;

//        } catch (OpenViduHttpException e) {
//            log.error(e.getMessage());
//            // 여기 왔다는 거는 forceDisconnect에서 에러났다는 소리고 세션 닫혔다는 소리니까 버리겠소
//            standbyRooms.poll();
//            return 0;

        } catch (Exception e) {
            log.error(e.getMessage());
            return 1;
        }
    }

    public int resetStandby(String id) throws OpenViduJavaClientException, OpenViduHttpException {
        // 성공 시 0, 실패 시 1 반환
        try {
            Session standbySession = standbyRooms.peek();

            if (!id.equals(standbySession.getSessionId())) {
                throw new NotFoundException("세션이 일치하지 않습니다");
            }

            // 대기방 종료시키기
            standbySession.close();

            // 대기방 리스트 정리 (종료시킨 방 버리고 작동하는 방을 앞에다 두기)
            checkActiveSessionAndUpdate();
//            standbyRooms.poll();
            return 0;

        } catch (OpenViduHttpException e) {
            log.error(e.getMessage());
            checkActiveSessionAndUpdate();
//            standbyRooms.poll();
            return 0;

        } catch (Exception e) {
            log.error(e.getMessage());
            return 1;
        }
    }

    public void increaseRoomBuffer() throws OpenViduJavaClientException, OpenViduHttpException {
        calculateMultiplierAndUpdate();
        for (int i = 0; i < poolAdditionNo; i++) {
            Session session = openVidu.createSession();
            standbyRooms.add(session);
        }
    }

    public void clearRoom(String id, Session session) throws OpenViduJavaClientException, OpenViduHttpException {
        // 세션 종료
        try {
            session.close();
        } catch (OpenViduHttpException e) {
            log.error(e.getMessage());
        }
        // 빈 세션을 HashMap에서 제거
        gameRooms.remove(id);
        calculateMultiplierAndUpdate();
    }

    public void toGameRooms(String sessionId) {
        Map<String, Object> sessionInfo = new ConcurrentHashMap<>();
        Session session = standbyRooms.poll();
        LocalDateTime startDate = LocalDateTime.now();
        sessionInfo.put("session", session);
        sessionInfo.put("startDate", startDate);
        gameRooms.put(sessionId, sessionInfo);
        calculateMultiplierAndUpdate();
    }

    public void resetRooms() throws OpenViduJavaClientException, OpenViduHttpException {
        for (String id : gameRooms.keySet()) {
            Session session = (Session) gameRooms.get(id).get("session");

            // 세션 종료 후 HashMap에서 제거
            try {
                session.close();
            } catch (OpenViduHttpException e) {
                log.error(e.getMessage());
            }
            gameRooms.remove(id);
        }

        while (!standbyRooms.isEmpty()) {
            standbyRooms.poll();
        }

        for (int i = 0; i < INITIAL_ROOM_NO; i++) {
            Session session = openVidu.createSession();
            standbyRooms.add(session);
        }
    }

    public void getInfo() {
        log.debug("standbyRoom : {}", standbyRooms.peek().getActiveConnections().toString());
        log.debug("gameRooms : {}", gameRooms.toString());
        log.debug("gameRooms count : {}", gameRooms.size());
        log.debug("standbyRooms count : {}", standbyRooms.size());
        log.debug("connected players count : {}", standbyRooms.peek().getActiveConnections().size());
        log.debug("multiplier : {}", multiplier);
    }
}
