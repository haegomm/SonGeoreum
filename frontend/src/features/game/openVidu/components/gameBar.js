import { useState } from "react";

const gameBar = (props) => {
  const playersList = props.playersList;
  const myNickname = props.myNickname;
  const wordsList = props.wordsList;
  const imageList = props.imageList;

  const [isQuizTime, setIsQuizTime] = useState(true);
  const [gameCnt, setGameCnt] = useState(0);
  const [scoreList, setSocreList] = useState([0, 0, 0, 0]);
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

  // 화면에 보이는 타이머
  const gameRoomTimer = setInterval(() => {
    setGameTime((gameTime) => gameTime + 1);
    if (quizSequence / 1000 === gameTime) {
      clearInterval(gameRoomTimer);
    }
  }, 1000);

  // 퀴즈 푸는 타이머
  const quizTimer = setTimeout(() => {
    setIsQuizTime(() => false);
    const curCnt = gameCnt;
    setGameCnt(() => curCnt + 1);
  }, quizSequence); // 채팅에서 답을 못맞추고 문제푸는 시간이 끝났을 때 게임횟차 올라가야함

  // 정답 보는 타이머
  const answerTimer = setTimeout(() => {
    setIsQuizTime(() => true);
  }, answerSequence);

  // 정답 확인 함수
  const checkAnswer = (nickName, chatMessage) => {
    const curAnswer = wordsList[gameCnt].name;
    if (nickName === myNickname && curAnswer === chatMessage) {
      const idx = Number(playersList.indexOf(nickName));
      const copyScoreList = [...setSocreList];
      copyScoreList[idx]++;
      setSocreList(() => copyScoreList);
      clearTimeout(quizTimer);
      clearInterval(gameRoomTimer);
      setIsQuizTime(() => false);
      const curCnt = gameCnt;
      setGameCnt(() => curCnt + 1);
    }
  };
};

return (
  <React.Fragment>
    <div className="timer-wrapper">
      <div>{gameTime}</div>
    </div>
  </React.Fragment>
);
