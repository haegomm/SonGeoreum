import { useEffect, useState } from "react";
import axios from "../../../../../common/api/https";
import { useNavigate } from "react-router-dom";
import AnswerVideo from "./AnswerVideo";
import ChatComponent from "./chat/ChatComponent";

const SideBar = (props) => {
  const playersList = props.playersList;
  const myNickname = props.myNickname;
  const questionList = props.wordsList;
  const [gameCnt, setGameCnt] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [scoreList, setSocreList] = useState([0, 0, 0, 0]);

  const navigate = useNavigate();

  const handletheEndGame = async () => {
    const result = await resultScore();
    navigate("result", { state: result });
    // props.leaveSession();
  };

  const resultScore = async () => {
    const result = [];
    for (let i = 0; i < 4; i++) {
      result.push({
        nickname: playersList[i],
        score: scoreList[i],
      });
      return result;
    }
  };

  const onShowAnswer = (status) => {
    // const show = !showAnswer
    setShowAnswer(() => status);
    console.log("지금은 영상을 볼 수", status);
  };

  const toNext = () => {
    console.log("다음 문제로 넘어갑니다.");
    const num = gameCnt + 1;
    setGameCnt(num);
    if (gameCnt === 12) {
      handletheEndGame();
    } else {
      console.log("다음 시작할 문제 번호: ", num);
      setTimeout(() => {
        onShowAnswer(false);
      }, 5000); // false
    }
  };

  const whoGetScore = (who) => {
    if (who) {
      const Idx = playersList.indexOf(who);
      setSocreList(() => (scoreList[Idx] += 1));
    }
    if (showAnswer === false) {
      setTimeout(() => {
        onShowAnswer(true);
      }, 5000);
      // onShowAnswer(true) // true
      setTimeout(() => {
        toNext();
      }, 5000);
    }
  };

  if (playersList && playersList.length > 0) {
    if (questionList) {
      return (
        <div>
          <div>
            {gameCnt === 12 ? (
              <div>
                <div>게임이 종료되었습니다</div>
                <div>결과창으로 넘어갑니다.</div>
              </div>
            ) : (
              <AnswerVideo
                className="box"
                myNickname={myNickname}
                answerWord={
                  gameCnt === 12 ? "null" : questionList[gameCnt].name
                }
                answerApi={
                  gameCnt === 12 ? "null" : questionList[gameCnt].contentUrl
                }
                presenter={playersList[gameCnt % 4]}
                showAnswer={showAnswer} //
                whoGetScore={whoGetScore()}
              />
            )}
          </div>
          <ChatComponent
            user={props.user}
            chatDisplay={props.chatDisplay}
            close={props.close}
            messageReceived={props.messageReceived}
            answerWord={gameCnt === 12 ? "null" : questionList[gameCnt].name}
            questionList={questionList}
            whoGetScore={whoGetScore()}
          />
        </div>
      );
    }
  }
};

export default SideBar;
