import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ChatComponent from "./sidebar/chat/ChatComponent";
import lock from "../assets/images/lock.jpg";
import "./sidebar/Timer.scss";

const GameBar = (props) => {
  const playersList = props.playersList;
  const myNickname = props.myNickname;
  const wordsList = props.wordsList;
  const imageList = props.imageList;
  const subscribers = props.subscribers;
  const localUser = props.user;

  const [isQuizTime, setIsQuizTime] = useState(true);
  const [gameTurnCnt, setGameTurnCnt] = useState(0);
  const [answerWord, setAnswerWord] = useState("");
  const [answerApi, setAnswerApi] = useState("");

  const scoreListRef = useRef([0, 0, 0, 0]);
  const presenter = useRef("");

  const quizSequence = 10000;
  const answerSequence = 7000;

  const [gameTime, setGameTime] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (wordsList && wordsList.length > 0) {
      setAnswerWord(() => wordsList[0].name);
      setAnswerApi(() => wordsList[0].contentUrl);
      presenter.current = playersList[0];
      quizTimeStart(0);
    }
  }, [wordsList]);

  // 화면 타이머 업데이트
  let timerGame;
  const gameRoomTimer = (gameCnt) => {
    gameRoomTimerStop(gameCnt);
    timerGame = setInterval(() => {
      setGameTime((gameTime) => gameTime + 1);
    }, 1000);
  };

  // 게임룸타이머 멈추기
  const gameRoomTimerStop = (gameCnt) => {
    setTimeout(() => {
      clearInterval(timerGame);
      answerTimeStart(gameCnt);
      setGameTime(() => 0);
    }, 10000);
  };

  // 퀴즈 푸는 시간 종료
  const quizTimeStop = () => {
    clearInterval(timerGame);
    clearTimeout(timerQuiz);
    setIsQuizTime(() => false);
  };

  // 정답을 맞추거나 타임아웃이 되었을 때 정답 시청시작.
  const answerTimeStart = (gameCnt) => {
    quizTimeStop();
    answerTimer(gameCnt);
  };

  // 퀴즈 푸는 타이머
  let timerQuiz;
  const quizTimer = () => {
    timerQuiz = setTimeout(() => {
      setIsQuizTime(() => false);
    }, quizSequence);
  };

  // 정답 보는 타이머
  const answerTimer = (gameCnt) => {
    setTimeout(() => {
      toNext(gameCnt); // 정답 시청이 끝난 후 다음 문제로 넘어갑니다
    }, answerSequence);
  };

  // 채팅 정답 확인 함수
  const checkAnswer = (nickName, chatMessage) => {
    if (answerWord === chatMessage) {
      const idx = Number(playersList.indexOf(nickName));
      scoreListRef.current[idx] += 1;

      // 정답자의 비디오를 찾아 CSS를 적용시켜 줍니다.
      let isMe = true;
      let streamId = null;

      subscribers.forEach((user) => {
        if (user.nickname === nickName) {
          isMe = false;
          streamId = user.streamManager.stream.streamId;
        }
      });

      if (isMe) {
        streamId = localUser.streamManager.stream.streamId;
      }

      if (streamId !== null) {
        let videoElement = document.getElementById("video-" + streamId);
        videoElement.classList.add("answerScreen");
        setTimeout(() => {
          videoElement.classList.remove("answerScreen");
        }, 5000);
      }
    }
  };

  // 다음 단계로 넘어가기
  const toNext = (gameCnt) => {
    setGameTurnCnt((gameTurnCnt) => gameCnt + 1);
    const nextCnt = gameCnt + 1;
    if (nextCnt === 12) {
      endGame();
      return;
    }
    setIsQuizTime(() => true);
    presenter.current = playersList[nextCnt % 4];
    setAnswerWord(() => wordsList[nextCnt].name);
    setAnswerApi(() => wordsList[nextCnt].contentUrl); // 다음 문제를 위한 정보 셋팅
    clearTimeout(timerQuiz);
    clearInterval(timerGame); // 확인사살
    quizTimeStart(nextCnt); // 문제 풀러 가기
  };

  // 퀴즈 푸는 시간 시작
  const quizTimeStart = (gameCnt) => {
    // 발표자의 비디오를 찾아 CSS를 적용시켜 줍니다.
    let isMe = true;
    let streamId = null;

    subscribers.forEach((user) => {
      if (user.nickname === presenter.current) {
        isMe = false;
        streamId = user.streamManager.stream.streamId;
      }
    });

    if (isMe) {
      streamId = localUser.streamManager.stream.streamId;
    }

    if (streamId !== null) {
      let videoElement = document.getElementById("video-" + streamId);
      videoElement.classList.add("presenterScreen");
      setTimeout(() => {
        videoElement.classList.remove("presenterScreen");
      }, quizSequence);
    }

    gameRoomTimer(gameCnt);
    quizTimer(); // 다음 문제 타이머 시작
    setIsQuizTime(() => true); // 퀴즈 푸는 시간입니다. => true
  };

  // 게임 종료 조건.
  const endGame = () => {
    const result = resultScore();
    navigate("/result", { state: result });
  };

  // 결과 값을 닉네임과 함께 객체로 묶어주기
  const resultScore = () => {
    const resultScoreList = scoreListRef.current;
    const result = [];
    for (let i = 0; i < 4; i++) {
      result.push({
        nickname: playersList[i],
        score: resultScoreList[i],
        image: imageList[i],
      });
    }
    return result.slice();
  };

  return (
    <div className="sidebar-wrapper">
      <React.Fragment>
        {gameTurnCnt > 11 ? (
          <div className="box resultMessageBox">
            <p>게임이 종료되었습니다</p>
            <p>잠시 뒤 결과창으로 넘어갑니다.</p>
          </div>
        ) : (
          <React.Fragment>
            {isQuizTime ? (
              <div className="timer-wrapper">
                <div>{gameTime}</div>
              </div>
            ) : (
              <div className="timer-wrapper">
                <div>정답을 따라해보세요😊</div>
              </div>
            )}
            <div className="box">
              {(isQuizTime && presenter.current === myNickname) ||
              !isQuizTime ? (
                <React.Fragment>
                  <div>
                    <h1>{answerWord}</h1>
                  </div>
                  <video
                    className="box-video"
                    autoPlay
                    muted
                    loop
                    src={answerApi}
                  ></video>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="box-text">무엇일까요?</div>
                  <img src={lock}></img>
                </React.Fragment>
              )}
            </div>
          </React.Fragment>
        )}
        <ChatComponent
          user={props.user}
          chatDisplay={props.chatDisplay}
          close={props.close}
          messageReceived={props.messageReceived}
          checkAnswer={checkAnswer}
        />
      </React.Fragment>
    </div>
  );
};

export default GameBar;
