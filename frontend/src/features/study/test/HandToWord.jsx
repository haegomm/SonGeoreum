import { useState, useEffect } from "react";
import axios from "axios";

import TestScreen from "../../../common/card/TestScreen";
import TestAnswer from "../../../common/card/TestAnswer";
import "./HandToWord.scss";

import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";

export default function HandToWord({ categoryNum, resetTestMode }) {
  const [wordList, setWordList] = useState([]); // 단어 목록
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
      setWordList(data.data);
      // 이 리스트 중에서 랜덤한 10개를 뽑는 로직 필요합니다.
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
    if (num === testList.length && !showAnswer && !showCorrect) {
      setTimeout(exitTest, 2000); // 결과 페이지로 넘어가야 합니다
    }
  };

  const correct = (num) => {
    console.log("정답효과 종료");
    setNumber(num);
    setShowCorrect(false);
    document.getElementById("inputBox").value = "";
  };

  const next = (num) => {
    console.log("다음 문제로 넘어갑니다");
    setNumber(num);
    setShowAnswer(false);
    const value = document.getElementById("inputBox");
    if (value) value.value = "";
  };

  const exitTest = () => {
    console.log("테스트를 종료합니다.");
    setNumber(0);
    setShowAnswer(false);
    setShowCorrect(false);
    resetTestMode();
    console.log("test result >> ", score);
  };

  const defaultText = "정답을 입력해주세요";
  const correctText = "정답입니다";
  const showAnswerText = "정답을 확인해보세요";
  const guide =
    !showAnswer && !showCorrect
      ? defaultText
      : showCorrect
      ? correctText
      : showAnswerText;

  const showAnswerWord = showAnswer ? (
    <TestAnswer myInput={myInput} answer={testList[number].name} />
  ) : (
    <div className="flexBox">
      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: 400,
          margin: "16px",
        }}
      >
        <InputBase
          id="inputBox"
          sx={{ ml: 1, flex: 1 }}
          placeholder="정답을 입력해주세요"
          inputProps={{ "aria-label": "search google maps" }}
          disabled={showCorrect}
        />

        <IconButton
          color="primary"
          aria-label="upload picture"
          component="label"
          onClick={() => inputValue()}
          disabled={showCorrect}
        >
          <SendIcon />
        </IconButton>
      </Paper>
    </div>
  );

  const showNextButton = showAnswer ? (
    <button className="fixedButton green" onClick={() => next(number + 1)}>
      다음
    </button>
  ) : null;

  const correctCircle = showCorrect ? null : null; // 이부분에 정답 효과를 넣습니다.

  if (testList && testList.length > 0 && number < testList.length) {
    return (
      <div>
        <div className="testBox">
          <div className="testGuideText">{guide}</div>
          <div className="fixedBox">
            {showNextButton}
            <button className="fixedButton red" onClick={exitTest}>
              종료
            </button>
          </div>
          <div className="flexBox">
            <TestScreen
              link={testList[number].contentUrl}
              categoryNum={categoryNum}
            />
          </div>
        </div>
        {correctCircle}
        {showAnswerWord}
      </div>
    );
  }
}
