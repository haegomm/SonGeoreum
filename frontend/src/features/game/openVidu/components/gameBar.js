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

  useEffect(() => {
    console.log("최초 게임시작");
    quizTimeStart();
  }, []);

  // 화면 타이머 업데이트
  const gameRoomTimer = setInterval(() => {
    setGameTime((gameTime) => gameTime + 1);
    if (quizSequence / 1000 === gameTime) {
      answerTimeStart();
    }
  }, 1000);

  // 퀴즈 푸는 시간 종료
  const quizTimeStop = () => {
    console.log("2. 퀴즈 푸는 시간 종료");
    clearInterval(gameRoomTimer);
    clearTimeout(quizTimer);
    setIsQuizTime(() => false);
  };

  // 정답을 맞추거나 타임아웃이 되었을 때 정답 시청시작.
  const answerTimeStart = () => {
    console.log("3. 정답 시청 시간 시작");
    quizTimeStop();
    answerTimer();
  };

  // 퀴즈 푸는 타이머
  const quizTimer = setTimeout(() => {
    setIsQuizTime(() => false);
  }, quizSequence);

  // 정답 보는 타이머
  const answerTimer = setTimeout(() => {
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
  console.log("4. 다음 단계로 넘어갑니다");
  const curCnt = gameCnt + 1;
  setGameCnt(() => curCnt);
  console.log("다음 단계 >> ", gameCnt);
  if (curCnt === 12) {
    endGame();
    return;
  }
  setIsQuizTime(() => true); //
  setPresenter(() => playersList[curCnt % 4]);
  setAnswerWord(() => wordsList[curCnt].name);
  setAnswerApi(() => wordsList[curCnt].contentUrl); // 다음 문제를 위한 정보 셋팅
  clearTimeout(quizTimer);
  clearInterval(gameRoomTimer); // 확인사살
  quizTimeStart();
};

// 퀴즈 푸는 시간 시작
const quizTimeStart = () => {
  console.log("1. 퀴즈 푸는 시간 시작");
  gameRoomTimer();
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
  <React.Fragment>
    <div className="timer-wrapper">
      <div>{gameTime}</div>
    </div>
    <div>지금 출제자: {presenter}</div>
    <br></br>
    <div className="box">
      {(isQuizTime && presenter === myNickname) || !isQuizTime ? (
        <React.Fragment>
          <div>
            <h1>{answerWord}</h1>
          </div>
          <video className="box-video" autoPlay>
            <source src={answerApi}></source>
          </video>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="box-text">무엇일까요?</div>
          <img src={lock}></img>
        </React.Fragment>
      )}
    </div>
    <ChatComponent
      user={props.user}
      chatDisplay={props.chatDisplay}
      close={props.close}
      messageReceived={props.messageReceived}
      checkAnswer={checkAnswer}
    />
  </React.Fragment>
);
