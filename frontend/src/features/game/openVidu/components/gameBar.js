import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatComponent from "./sidebar/chat/ChatComponent";
import lock from "../assets/images/lock.jpg";
import "./sidebar/Timer.scss";

const GameBar = (props) => {
  const playersList = props.playersList;
  const myNickname = props.myNickname;
  const wordsList = props.wordsList;
  const imageList = props.imageList;

  const [isQuizTime, setIsQuizTime] = useState(true);
  const [gameTurnCnt, setGameTurnCnt] = useState(0);
  const [scoreList, setScoreList] = useState([0, 0, 0, 0]);
  const [presenter, setPresenter] = useState("");
  const [answerWord, setAnswerWord] = useState("");
  const [answerApi, setAnswerApi] = useState("");

  const quizSequence = 10000;
  const answerSequence = 10000;

  const [lastCnt, setLastCnt] = useState(-1);

  const [gameTime, setGameTime] = useState(0);

  const navigate = useNavigate();

  console.log("게임 카운트! >> ", gameTurnCnt);
  useEffect(() => {
    if (wordsList && wordsList.length > 0) {
      console.log("최초 게임시작");
      setAnswerWord(() => wordsList[0].name);
      setAnswerApi(() => wordsList[0].contentUrl);
      setPresenter(() => playersList[0]);
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
    console.log("2. 퀴즈 푸는 시간 종료");
    clearInterval(timerGame);
    clearTimeout(timerQuiz);
    setIsQuizTime(() => false);
  };

  // 정답을 맞추거나 타임아웃이 되었을 때 정답 시청시작.
  const answerTimeStart = (gameCnt) => {
    if (gameCnt === lastCnt) {
      console.log("이미 정답 맞춤", lastCnt);
      return;
    }
    console.log("3. 정답 시청 시간 시작");
    quizTimeStop();
    answerTimer(gameCnt);
    setLastCnt(() => gameCnt);
    console.log("게임! >> ", gameCnt);
    console.log("라스트! >> ", lastCnt);
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
    // const curAnswer = answerWord;
    console.log("채팅 친 사람 >> ", nickName);
    console.log("채팅 내용 >> ", chatMessage);
    console.log("정답 단어 >> ", answerWord);
    if (answerWord === chatMessage) {
      const idx = Number(playersList.indexOf(nickName));
      const copyScoreList = [...scoreList];
      copyScoreList[idx]++;
      setScoreList(() => copyScoreList);
      console.log("정답자 스코어 올려줬다 >> ", scoreList);
      setIsQuizTime(() => false);
      //   answerTimeStart(gameTurnCnt); //
    }
  };

  // 다음 단계로 넘어가기
  const toNext = (gameCnt) => {
    console.log("4. 다음 단계로 넘어갑니다");
    // const curCnt = gameCnt + 1;
    setGameTurnCnt((gameTurnCnt) => gameCnt + 1);
    // console.log("다음 단계 >> ", gameCnt);
    const nextCnt = gameCnt + 1;
    if (gameCnt === 12) {
      endGame();
      return;
    }
    setIsQuizTime(() => true); //
    setPresenter(() => playersList[nextCnt % 4]);
    setAnswerWord(() => wordsList[nextCnt].name);
    setAnswerApi(() => wordsList[nextCnt].contentUrl); // 다음 문제를 위한 정보 셋팅
    clearTimeout(timerQuiz);
    clearInterval(timerGame); // 확인사살
    quizTimeStart(nextCnt); // 문제 풀러 가기
  };

  // 퀴즈 푸는 시간 시작
  const quizTimeStart = (gameCnt) => {
    console.log("1. 퀴즈 푸는 시간 시작");
    gameRoomTimer(gameCnt);
    quizTimer(); // 다음 문제 타이머 시작
    setIsQuizTime(() => true); // 퀴즈 푸는 시간입니다. => true
  };

  // 게임 종료 조건
  const endGame = () => {
    console.log("모든 게임이 종료되었습니다.");
    const result = resultScore();
    navigate("/result", { state: result });
  };

  // 결과 값을 닉네임과 함께 객체로 묶어주기
  const resultScore = () => {
    const result = [];
    for (let i = 0; i < 4; i++) {
      result.push({
        nickname: playersList[i],
        score: scoreList[i],
        image: imageList[i],
      });
    }
    return result;
  };

  return (
    <div className="sidebar-wrapper">
      <React.Fragment>
        {gameTurnCnt === 12 ? (
          <div className="box resultMessageBox">
            <p>게임이 종료되었습니다</p>
            <p>잠시 뒤 결과창으로 넘어갑니다.</p>
          </div>
        ) : (
          <React.Fragment>
            <div className="timer-wrapper">
              <div>{gameTime}</div>
              <div> 현재 출제자: {presenter}</div>
            </div>
            <div className="box">
              {(isQuizTime && presenter === myNickname) || !isQuizTime ? (
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
