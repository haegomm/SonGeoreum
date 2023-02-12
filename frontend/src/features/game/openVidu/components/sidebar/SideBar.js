import { useEffect, useState } from "react";
import axios from "../../../../../common/api/https";
import { useNavigate } from "react-router-dom";
import AnswerVideo from "./AnswerVideo";
import ChatComponent from "./chat/ChatComponent";

const SideBar = (props) => {
  const playerList = props.playerList;
  const myNickname = props.myNickname;
  const [gameCnt, setGameCnt] = useState(0);
  const [questionList, setQuestionList] = useState();
  const [showAnswer, setShowAnswer] = useState(false);
  let scoreList = [0, 0, 0, 0];

  const navigate = useNavigate();

  const handletheEndGame = (result) => {
    props.theEndGame();
    navigate("result", { state: result });
  };

  // useEffect(() => {
  //   getWordList();
  // }, []);

  // const getWordList = async () => {
  //   try {
  //     const response = await axios.get(
  //       "/api/words?isRandom=true&isTestable=false&num=12"
  //     );
  //     console.log("단어리스트를 가지고 왔어요", response.data);
  //     setQuestionList(response.data);
  //     console.log("문제들이야!!!!", questionList);
  //     return response.data;
  //   } catch (err) {
  //     console.log("단어리스트를 못 가져왔는뎅ㅜ!!!", err);
  //   }
  // };

  const resultScore = () => {
    const result = [];
    for (let i = 0; i < 4; i++) {
      result.push({
        nickname: playerList[i],
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
      handletheEndGame(resultScore());
    } else {
      console.log("다음 시작할 문제 번호: ", num);
      setTimeout(() => {
        onShowAnswer(false);
      }, 5000); // false
    }
  };

  //   const changeAnswer = (num) => {
  //     console.log("다음 게임 시작 >>", num)
  //       console.log("다음 문제", questionList[num].name)
  // }

  const whoGetScore = (who) => {
    if (who) {
      let Idx = playerList.indexOf(who);
      scoreList[Idx] += 1;
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

  const test = showAnswer ? "정답보여줌" : "문제푸는중";

  if (playerList && playerList.length > 0) {
    if (questionList) {
      return (
        <div>
          <div>
            {gameCnt} {test}
          </div>
          <AnswerVideo
            className="box"
            myNickname={myNickname}
            answerWord={questionList[gameCnt].name}
            answerApi={questionList[gameCnt].contentUrl}
            presenter={playerList[gameCnt % 4]}
            showAnswer={showAnswer} //
            whoGetScore={whoGetScore()}
          />
          <ChatComponent
            user={props.user}
            chatDisplay={props.chatDisplay}
            close={props.close}
            messageReceived={props.messageReceived}
            answerWord={questionList[gameCnt].name}
            whoGetScore={whoGetScore()}
          />
        </div>
      );
    }
  }
};

export default SideBar;
