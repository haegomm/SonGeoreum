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
  const gameTime = 0;

  // 화면에 보이는 타이머
  const gameRoomTimer = setInterval(() => {
    gameTime += 1;
    if (quizSequence / 1000 === gameTime) {
      clearInterval(gameRoomTimer);
    }
  }, 1000);

  // 퀴즈 푸는 타이머
  const quizTimer = setTimeout(() => {
    setIsQuizTime(() => false);
  }, quizSequence);

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
      setIsQuizTime(() => false);
      const curCnt = gameCnt;
      setGameCnt(() => curCnt + 1);
    }
  };
};

return (
  <React.Fragment>
    <div className="timer-wrapper">
      <CountdownCircleTimer
        size={80}
        isPlaying
        duration={5}
        colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
        onComplete={() => ({ shouldRepeat: true, delay: 5 })}
      >
        {renderTime}
      </CountdownCircleTimer>
    </div>
  </React.Fragment>
);
