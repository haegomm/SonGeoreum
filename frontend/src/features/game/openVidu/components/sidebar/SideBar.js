import React, { useEffect, useState } from "react";
import axios from "../../../../../common/api/https";
import { useNavigate } from "react-router-dom";
import AnswerVideo from "./AnswerVideo";
import ChatComponent from "./chat/ChatComponent";

const SideBar = (props) => {
  const playersList = props.playersList; // *** 임시 ***
  // const playersList = [0, 1, 2, 3];
  const myNickname = props.myNickname;
  const questionList = props.wordsList; // *** 임시 ***
  // const questionList = [0, 1, 2, 3];
  const imageList = props.imageList;
  const [gameCnt, setGameCnt] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [scoreList, setSocreList] = useState([0, 0, 0, 0]);

  const navigate = useNavigate();

  const handletheEndGame = async () => {
    const result = await resultScore();
    navigate("/result", { state: result });
    // props.leaveSession();
  };

  const resultScore = async () => {
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
      // *** 임시 ***
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
    // *** 임시 ***
    if (questionList) {
      return (
        <div className="sidebar-wrapper">
          <React.Fragment>
            {gameCnt === 12 ? (
              <div className="box resultMessageBox">
                <p>게임이 종료되었습니다</p>
                <p>잠시 뒤 결과창으로 넘어갑니다.</p>
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
          </React.Fragment>
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
