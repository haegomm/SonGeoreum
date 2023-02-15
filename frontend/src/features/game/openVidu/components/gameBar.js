import { useState } from "react";

const gameBar = (props) => {
  const playersList = props.playersList;
  const myNickname = props.myNickname;
  const wordsList = props.wordsList;
  const imageList = props.imageList;

  const [isQuizTime, setIsQuizTime] = useState(true);
  const [gameCnt, setGameCnt] = useState(0);
  const [scoreList, setSocreList] = useState([0, 0, 0, 0]);
  const [presenter, setPresenter] = useState(playersList[0]);
  const [answerWord, setAnswerWord] = useState(wordsList[0].name);
  const [answerApi, setAnswerApi] = useState(wordsList[0].contentUrl);

  const quizSequence = 10000;
  const answerSequence = 10000;
  //   const gameTime = 0;
  const [gameTime, setGameTime] = useState(0);

  //   const gameRoomTimer = setInterval(() => {
  //     gameTime += 1;
  //     if (quizSequence / 1000 === gameTime) {
  //       clearInterval(gameRoomTimer);
  //     }
  //   }, 1000);

  // 화면 타이머 업데이트
  const gameRoomTimer = setInterval(() => {
    setGameTime((gameTime) => gameTime + 1);
    if (quizSequence / 1000 === gameTime) {
      answerTimeStart();
    }
  }, 1000);

  // 퀴즈
  const quizTimeStop = () => {
    clearInterval(gameRoomTimer);
    clearTimeout(quizTimer);
    setIsQuizTime(() => flase);
  };

  // 정답을 맞추거나 타임아웃이 되었을 때 정답 시청한다.
  const answerTimeStart = () => {
    quizTimeStop();
    clearInterval(gameRoomTimer);
    answerTimer();
  };

  // 퀴즈 푸는 타이머
  const quizTimer = setTimeout(() => {
    setIsQuizTime(() => false);
  }, quizSequence);

  // 정답 보는 타이머
  const answerTimer = setTimeout(() => {
    setIsQuizTime(() => true);
    toNext(); // 정답 시청이 끝난 후 다음 문제로 넘어갑니다
  }, answerSequence);

  // 채팅 정답 확인 함수
  const checkAnswer = (nickName, chatMessage) => {
    const curAnswer = wordsList[gameCnt].name;
    if (nickName === myNickname && curAnswer === chatMessage) {
      const idx = Number(playersList.indexOf(nickName));
      const copyScoreList = [...setSocreList];
      copyScoreList[idx]++;
      setSocreList(() => copyScoreList);
      setIsQuizTime(() => false);
      answerTimeStart();
    }
  };
};

// 다음 단계로 넘어가기
const toNext = () => {
  const curCnt = gameCnt + 1;
  setGameCnt(() => curCnt);
  setPresenter(() => playersList[curCnt % 4]);
  setAnswerWord(() => wordsList[curCnt].name);
  setAnswerApi(() => wordsList[curCnt].contentUrl); // 다음 문제를 위한 정보 셋팅
  clearTimeout(quizTimer);
  clearInterval(gameRoomTimer); // 확인사살
  quizTimeStart();
};

const quizTimeStart = () => {
  gameRoomTimer();
  quizTimer(); // 다음 문제 타이머 시작
  setIsQuizTime(() => true); // 문제 푸는 시간입니다. => true
};

return (
  <React.Fragment>
    <div className="timer-wrapper">
      <div>{gameTime}</div>
    </div>
  </React.Fragment>
);
