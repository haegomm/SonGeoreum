import { useState, useEffect } from "react";
import axios from "axios";

import TestScreen from "../../../common/card/TestScreen";
import TestAnswer from "../../../common/card/TestAnswer";
import MotionTest from "./MotionTest";
import TopCard from "../../../common/card/TopCard";
import "./HandToWord.scss";
import "../../../common/card/TestScreen.scss";

import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";

export default function WordToHand({ categoryNum, resetTestMode }) {
  const [testList, setTestList] = useState([]); // 실제 시험 보는 단어 목록
  const [number, setNumber] = useState(0); // 현재 문제 번호
  const [myInput, setMyInput] = useState(""); // 사용자가 입력한 답
  const [showCorrect, setShowCorrect] = useState(false); // 정답 시 효과 보여주기
  const [showAnswer, setShowAnswer] = useState(false); // 오답 시 정답 보여주기
  const [score, setScore] = useState(0); // 점수

  useEffect(() => {
    async function getInfo() {
      const data = await axios.get(
        `https://i8b106.p.ssafy.io/api/words?categoryId=${categoryNum}&isRandom=true`
      );
      setTestList(data.data);
      console.log("data >> ", data.data);
    }
    getInfo();
  }, []);

  const inputValue = () => {
    const text = document.getElementById("inputBox").value;
    console.log(text);
    setMyInput(text);
    const num = number + 1;
    if (text === testList[number].name) {
      console.log("정답입니다", num);
      setShowCorrect(true);
      const nowScore = score + 1;
      setScore(nowScore);
      setTimeout(correct, 2000, num);
    } else {
      console.log("틀렸습니다", num);
      setShowAnswer(true);
    }
    if (num === 10 && !showAnswer) {
      setTimeout(exitTest, 1000); // 결과 페이지로 넘어가야 합니다
    }
  };

  const startCorrect = () => {
    const num = number + 1;
    console.log("정답입니다", num);
    setShowAnswer(true);
    setShowCorrect(true);
    const nowScore = score + 1;
    setScore(nowScore);
    // setTimeout(correct, 2000, num);
  };

  const correct = (num) => {
    console.log("정답효과 종료");
    setNumber(num);
    // setShowAnswer(false);
    // setShowCorrect(false);
    // document.getElementById("inputBox").value = "";
  };

  const next = (num) => {
    if (num === 10) {
      setTimeout(exitTest, 2000); // 결과 페이지로 넘어가야 합니다
    } else {
      console.log("다음 문제로 넘어갑니다");
      setNumber(num);
      setShowAnswer(false);
      setShowCorrect(false);
    }
  };

  const exitTest = () => {
    console.log("테스트를 종료합니다.");
    setNumber(0);
    setShowAnswer(false);
    // setShowCorrect(false);
    resetTestMode();
    console.log("test result >> ", score);
  };

  const defaultText = "제시어를 보고 수어로 표현해보세요";
  const correctText = "정답입니다";
  const showAnswerText = "정답을 확인해보세요";
  const guide = showAnswer
    ? showCorrect
      ? correctText
      : showAnswerText
    : defaultText;

  const showAnswerWord =
    testList && testList.length > 0 ? (
      showAnswer ? (
        <div className="flexBox">
          <img
            className="answerImage"
            src={testList[number].contentUrl}
            referrerPolicy="no-referrer"
          />
          <button className="green" onClick={() => next(number + 1)}>
            다음 문제
          </button>
        </div>
      ) : (
        <div className="flexBox">
          <MotionTest
            word={testList[number].name}
            categoryNum={categoryNum}
            startCorrect={startCorrect}
          />
        </div>
      )
    ) : null;

  const correctCircle = showCorrect ? null : null; // 이부분에 정답 효과를 넣습니다.

  const buttonShow = showAnswer ? null : (
    <button className="fixedButton yellow" onClick={() => setShowAnswer(true)}>
      PASS
    </button>
  );

  if (testList && testList.length > 0 && number < testList.length) {
    return (
      <div>
        <div className="motionTestBox">
          <div className="fixedBox">
            {buttonShow}
            <button className="fixedButton red" onClick={exitTest}>
              종료
            </button>
          </div>
          <div>
            <TopCard text={testList[number].name} />
          </div>
          <div className="flexBox">
            <div className="testScreen motionGuideText">
              {guide}
              {/* 타이머 넣고 싶어요 */}
              <div className="canvasText">3초 후 카메라가 나옵니다</div>
              {showAnswerWord}
            </div>
          </div>
        </div>
        {correctCircle}
      </div>
    );
  }
}
