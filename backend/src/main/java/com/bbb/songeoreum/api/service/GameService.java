package com.bbb.songeoreum.api.service;

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
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

/**
 * {@code GameService}는 게임 관련 로직을 처리하는 서비스입니다.
 *
 * @author Youngmook-Lim
 * @version 1.0
 */
@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class GameService {
    private final GamelogRepository gamelogRepository;
    private final GamelogUserRepository gamelogUserRepository;
    private final UserRepository userRepository;

    /**
     * OpenVidu 서버 URL 및 암호키를 설정합니다
     */
    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;
    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    /**
     * OpenVidu session 및 connection을 생성하기 위한 OpenVidu 객체입니다
     */
    private OpenVidu openVidu;

    /**
     * 대기방(session)을 담는 Queue 자료구조입니다
     */
    private Queue<Session> standbyRooms;


    /**
     * 게임 중인 방(session)을 담는 Map 자료구조입니다
     */
    private Map<String, Map<String, Object>> gameRooms;

    /**
     * 서버 구동 시 최초 생성되는 session pool의 크기입니다
     */
    private static final int INITIAL_ROOM_NO = 10;

    /**
     * 현재 진행중이 게임방의 갯수에 정비례한 muliplier 값입니다
     * 진행중인 게임방의 갯수가 많을수록 대기방 갯수의 하한선이 높아지며
     * 하한선 도달 시 추가되는 대기방 갯수도 높아집니다
     * 기본값은 1입니다
     */
    private int multiplier = 1;

    /**
     * 대기방 갯수의 하한선을 지정합니다
     * 하한선 이하로 대기방 갯수가 떨어지게 되면 자동으로 대기방이 추가됩니다
     */
    private static final double POOL_REDZONE_RATIO = 0.5;
    private int poolRedzoneNo = (int) (INITIAL_ROOM_NO * POOL_REDZONE_RATIO * multiplier);

    /**
     * 하한선 이하로 대기방 갯수가 하락할 시 추가되는 대기방 갯수를 지정합니다
     */
    private static final double POOL_ADDITION_RATIO = 0.3;
    private int poolAdditionNo = (int) (INITIAL_ROOM_NO * POOL_ADDITION_RATIO * multiplier);

    /**
     * 한 게임의 참가자 수를 지정합니다
     */
    private static final int ROOM_SIZE = 4;

    /**
     * 게임의 최대시간을 지정합니다
     * 해당 최대시간을 초과할 시 Garbage Collector가 해당 게임을 종료 및 초기화 시킵니다
     */
    private static final int MAX_GAME_TIME_MINUTES = 15;

    /**
     * 대기방과 게임방의 session을 관리하는 Garbage Collector의 구동 주기입니다
     */
    private static final int GC_INTERVAL_MINUTES = 5;

    /**
     * Spring Boot 서버 구동 후 1회 호출되는 메서드입니다
     * 대기방 Queue와 게임방 Map을 초기화하고 대기방 session pool을 형성합니다
     * 대기방과 게임방을 담는 자료구조는 Thread-Safe를 보장하기 위해 각각 ConcurrentLinkedQueue, ConcurrentHashMap를 사용합니다
     *
     * @throws OpenViduJavaClientException
     * @throws OpenViduHttpException
     */
    @PostConstruct
    public void initialSetup() throws OpenViduJavaClientException, OpenViduHttpException {
        this.openVidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);

        standbyRooms = new ConcurrentLinkedQueue<>();
        gameRooms = new ConcurrentHashMap<>();

        for (int i = 0; i < INITIAL_ROOM_NO; i++) {
            Session session = openVidu.createSession();
            standbyRooms.add(session);
        }

    }

    /**
     * Session을 관리하는 Garbage Collector 입니다
     * 주기적으로 대기방과 게임방을 탐색하며 비정상적으로 오래 살아있거나 닫혀버린 session을 정리합니다
     *
     * @throws OpenViduJavaClientException
     * @throws OpenViduHttpException
     */
    @Scheduled(fixedRate = GC_INTERVAL_MINUTES * 60000)
    public void garbageCollector() throws OpenViduJavaClientException, OpenViduHttpException {
        log.debug("Session Garbage Collector 출동");

        checkActiveSessionAndUpdate();

        for (String id : gameRooms.keySet()) {
            Map<String, Object> sessionInfo = gameRooms.get(id);
            LocalDateTime startDate = (LocalDateTime) sessionInfo.get("startDate");
            Duration duration = Duration.between(startDate, LocalDateTime.now());
            log.debug("게임 시작 후 지난 시간(분) : {}", duration.toMinutes());
            if (duration.toMinutes() >= MAX_GAME_TIME_MINUTES) {
                clearGameRoom(id, (Session) sessionInfo.get("session"));
                log.debug("세션 {} gameRooms에서 퇴출", id);
            }
        }
    }

    /**
     * 현재 대기방 session에 유저를 연결하기 위해 connection을 생성합니다
     * 해당 유저가 DB상에 존재하는 유저인지, 현재 대기방에 중복 유저가 있는지를 확인합니다
     * 대기방에 연결된 유저의 수가 4명이면 해당 session을 대기방에서 제거하고 게임방으로 이동시킵니다
     * 대기방 갯수가 REDZONE 미만으로 하락 시 대기방을 추가해 줍니다
     *
     * @param userId 해당 유저의 id
     * @return Session 입장을 위한 token, 게임 시작 여부 playGame, sessionId, 현재 연결된 유저 리스트를 반환합니다
     * @throws OpenViduJavaClientException
     * @throws OpenViduHttpException
     */
    public EnterRoomRes enterRoom(Long userId) throws OpenViduJavaClientException, OpenViduHttpException {

        Session availableSession = checkActiveSessionAndUpdate();
        String sessionId = availableSession.getSessionId();

        for (Connection c : availableSession.getActiveConnections()) {
            Long cId = Long.parseLong(c.getServerData());
            if (userId.equals(cId)) {
                throw new DuplicateUserException();
            }
        }

        if (!userRepository.findById(userId).isPresent()) {
            throw new NotFoundException("해당 유저를 찾을 수 없습니다.");
        }

        int connectedPlayersCnt = availableSession.getActiveConnections().size();
        boolean playGame = false;
        String token = null;
        Connection connection = null;
        EnterRoomRes enterRoomRes = null;


        if (standbyRooms.size() < poolRedzoneNo) {
            increaseRoomBuffer();
        }

        if (connectedPlayersCnt == ROOM_SIZE) {
            toGameRooms(sessionId);
            availableSession = checkActiveSessionAndUpdate();
        } else if (connectedPlayersCnt > ROOM_SIZE) {
            throw new RoomOverflowException();
        }

        ConnectionProperties connectionProperties = new ConnectionProperties.Builder()
                .data(userId.toString())
                .build();

        try {
            connection = availableSession.createConnection(connectionProperties);
        } catch (Exception e) {
            throw new NoConnectionError();
        }

        connectedPlayersCnt++;

        log.debug("connectedPlayersCnt : {}", connectedPlayersCnt);

        if (connectedPlayersCnt == ROOM_SIZE) {
            toGameRooms(sessionId);
            playGame = true;
        }

        if (standbyRooms.size() < poolRedzoneNo) {
            increaseRoomBuffer();
        }

        enterRoomRes = EnterRoomRes.builder()
                .token(connection.getToken())
                .playGame(playGame)
                .sessionId(sessionId)
                .playersList(new ArrayList<>()).build();

        for (Connection c : availableSession.getActiveConnections()) {
            Long cUserId = Long.parseLong(c.getServerData());
            User user = userRepository.findById(cUserId).orElseThrow(NotFoundException::new);

            enterRoomRes.getPlayersList().add(user.getNickname());
        }

        enterRoomRes.getPlayersList().add(userRepository.findById(userId).orElseThrow(NotFoundException::new).getNickname());

        List<String> activeConnections = new ArrayList<>();
        for (Connection c : standbyRooms.peek().getActiveConnections()) {
            activeConnections.add(userRepository.findById(Long.parseLong(c.getServerData())).orElseThrow(NotFoundException::new).getNickname());
        }

        List<String> allConnections = new ArrayList<>();
        for (Connection c : standbyRooms.peek().getConnections()) {
            allConnections.add(userRepository.findById(Long.parseLong(c.getServerData())).orElseThrow(NotFoundException::new).getNickname());
        }

        log.debug("standbyRoom(active) : {}", activeConnections);
        log.debug("standbyRoom(all) : {}", allConnections);
        log.debug("playersList : {}", enterRoomRes.getPlayersList().toString());
        log.debug("gameRooms : {}", gameRooms.toString());
        log.debug("gameRooms count : {}", gameRooms.size());
        log.debug("standbyRooms count : {}", standbyRooms.size());
        log.debug("connected players count(active) : {}", activeConnections.size());
        log.debug("connected players count(all) : {}", allConnections.size());
        log.debug("multiplier : {}", multiplier);

        return enterRoomRes;
    }

    /**
     * 대기방에서 유저가 퇴장할 시 대기방 상태를 확인하고 마지막 유저가 퇴장하여 대기방이 종료되었다면 열려있는 대기방으로 대채합니다
     *
     * @param sessionId session의 sessionId
     * @param userId    user의 userId
     * @throws OpenViduJavaClientException
     * @throws OpenViduHttpException
     */
    public void removeUser(String sessionId, Long userId) throws OpenViduJavaClientException, OpenViduHttpException {

        log.debug("특정 유저 대기방 퇴장 시 호출");

        Session standbySession = standbyRooms.peek();

        if (!sessionId.equals(standbySession.getSessionId())) {
            log.error("특정 유저를 퇴장시키는 과정에서 세션이 일치하지 않습니다.");
            throw new NotFoundException("세션이 일치하지 않습니다");
        }

        try {
            for (Connection c : standbySession.getConnections()) {
                if (Long.parseLong(c.getServerData()) == userId) {
                    standbySession.forceDisconnect(c);
                }
            }
        } catch (Exception e) {
            log.error("대기방에서 나간 유저 강제해제 실패했지만 괜찮음");
        }

        checkActiveSessionAndUpdate();

    }

    /**
     * 해당 게임방을 종료시키고 HashMap에서 제거합니다
     * 게임 로그를 DB에 저장합니다
     *
     * @param id session의 sessionId
     * @throws OpenViduJavaClientException
     * @throws OpenViduHttpException
     */
    @Transactional
    public void exitRoom(String id) throws OpenViduJavaClientException, OpenViduHttpException {

        Map<String, Object> sessionInfo = gameRooms.get(id);
        Session session = null;

        try {
            session = (Session) sessionInfo.get("session");
        } catch (Exception e) {
            log.debug("게임방 종료 단계에서 다른 유저로 인해 이미 세션이 삭제되었습니다.");
            throw new NotFoundException("세션을 찾을 수 없습니다.");
        }

        LocalDateTime startDate = (LocalDateTime) sessionInfo.get("startDate");
        LocalDateTime endDate = LocalDateTime.now();
        String sessionId = session.getSessionId();

        Gamelog gamelog = Gamelog.builder()
                .startDate(startDate)
                .endDate(endDate)
                .sessionId(sessionId)
                .build();

        gamelogRepository.save(gamelog);

        for (Connection c : session.getActiveConnections()) {
            Long userId = Long.parseLong(c.getServerData());
            User user = userRepository.findById(userId).orElseThrow(NotFoundException::new);

            GamelogUser gamelogUser = GamelogUser.builder()
                    .user(user)
                    .gamelog(gamelog)
                    .build();

            gamelogUserRepository.save(gamelogUser);
        }

        clearGameRoom(id, session);

        log.debug("gameRooms : {}", gameRooms.toString());
        log.debug("standbyRooms size : {}", standbyRooms.size());
        log.debug("게임방이 성공적으로 삭제되었습니다.");

    }

    /**
     * 대기방에 있는 모든 유저들을 퇴출시키고 대기방을 초기화합니다
     *
     * @param id session의 sessionId
     * @throws OpenViduJavaClientException
     * @throws OpenViduHttpException
     */
    public void resetStandby(String id) throws OpenViduJavaClientException, OpenViduHttpException {
        try {
            Session standbySession = standbyRooms.peek();

            if (!id.equals(standbySession.getSessionId())) {
                log.error("대기방 초기화 단계에서 세션이 일치하지 않습니다");
                throw new NotFoundException("세션이 일치하지 않습니다");
            }

            standbySession.close();

            checkActiveSessionAndUpdate();

        } catch (OpenViduHttpException e) {
            log.debug(e.getMessage() + " : 이미 세션이 종료되어서 예외 발생. 정상 작동 중입니다.");
            checkActiveSessionAndUpdate();

        }
    }

    /**
     * 대기방에 session을 지정 갯수만큼 추가합니다
     *
     * @throws OpenViduJavaClientException
     * @throws OpenViduHttpException
     */
    public void increaseRoomBuffer() throws OpenViduJavaClientException, OpenViduHttpException {
        calculateMultiplierAndUpdate();
        for (int i = 0; i < poolAdditionNo; i++) {
            Session session = openVidu.createSession();
            standbyRooms.add(session);
        }
    }

    /**
     * Multiplier 값을 계산하고 대기방의 REDZONE 값, 추가 session 갯수를 갱신합니다
     */
    public void calculateMultiplierAndUpdate() {
        int gameRoomCnt = gameRooms.size();

        multiplier = gameRoomCnt / INITIAL_ROOM_NO + 1;

        poolRedzoneNo = (int) (INITIAL_ROOM_NO * POOL_REDZONE_RATIO * multiplier);
        poolAdditionNo = (int) (INITIAL_ROOM_NO * POOL_ADDITION_RATIO * multiplier);

    }

    /**
     * 대기방 Queue의 head를 탐색하며 닫혀있는 session을 제거하고 필요 시 session을 대기방에 추가합니다
     *
     * @return
     * @throws OpenViduJavaClientException
     * @throws OpenViduHttpException
     */
    public Session checkActiveSessionAndUpdate() throws OpenViduJavaClientException, OpenViduHttpException {
        Session returnSession = null;
        while (!standbyRooms.isEmpty()) {
            try {
                returnSession = standbyRooms.peek();
                returnSession.fetch();
                return returnSession;
            } catch (Exception e) {
                standbyRooms.poll();
                log.debug("대기방 Queue에서 만료함 세션 처리 완료");
                if (standbyRooms.size() < poolRedzoneNo) {
                    increaseRoomBuffer();
                }
            }
        }
        increaseRoomBuffer();
        return standbyRooms.peek();
    }

    /**
     * 해당 게임 session을 초기화하고 게임방에서 삭제합니다
     *
     * @param id      session의 sessionId
     * @param session 삭제할 session
     * @throws OpenViduJavaClientException
     * @throws OpenViduHttpException
     */
    public void clearGameRoom(String id, Session session) throws OpenViduJavaClientException, OpenViduHttpException {
        try {
            session.close();
        } catch (OpenViduHttpException e) {
            log.error(e.getMessage() + " : 이미 세션이 종료되어서 예외 발생. 정상 작동 중입니다.");
        }
        gameRooms.remove(id);
        calculateMultiplierAndUpdate();
    }

    /**
     * 해당 session을 대기방에서 게임방으로 이동합니다
     *
     * @param sessionId session의 sessionId
     */
    public void toGameRooms(String sessionId) {
        Map<String, Object> sessionInfo = new ConcurrentHashMap<>();
        Session session = standbyRooms.poll();
        LocalDateTime startDate = LocalDateTime.now();
        sessionInfo.put("session", session);
        sessionInfo.put("startDate", startDate);
        gameRooms.put(sessionId, sessionInfo);
        calculateMultiplierAndUpdate();
    }

    // 개발용 : 대기방, 게임방 전체 초기화
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

    // 개발용 : 정보 조회
    public void getInfo() throws OpenViduJavaClientException, OpenViduHttpException {
        checkActiveSessionAndUpdate();

        List<String> activeConnections = new ArrayList<>();
        for (Connection c : standbyRooms.peek().getActiveConnections()) {
            activeConnections.add(userRepository.findById(Long.parseLong(c.getServerData())).orElseThrow(NotFoundException::new).getNickname());
        }

        List<String> allConnections = new ArrayList<>();
        for (Connection c : standbyRooms.peek().getConnections()) {
            allConnections.add(userRepository.findById(Long.parseLong(c.getServerData())).orElseThrow(NotFoundException::new).getNickname());
        }

        log.debug("standbyRoom(active) : {}", activeConnections);
        log.debug("standbyRoom(all) : {}", allConnections);
        log.debug("gameRooms : {}", gameRooms.toString());
        log.debug("gameRooms count : {}", gameRooms.size());
        log.debug("standbyRooms count : {}", standbyRooms.size());
        log.debug("connected players count(active) : {}", activeConnections.size());
        log.debug("connected players count(all) : {}", allConnections.size());
        log.debug("multiplier : {}", multiplier);
    }
}
