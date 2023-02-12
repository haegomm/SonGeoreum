import { useState, useEffect } from "react";
import axios from "../../../common/api/https";

import TestScreen from "../../../common/card/TestScreen";
import TestAnswer from "../../../common/card/TestAnswer";
import "./HandToWord.scss";

import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";

export default function HandToWord({ categoryNum, isTuto, finishTest }) {
  let num = categoryNum;
  if (!isTuto) num = 3;
  const [testList, setTestList] = useState([]); // 실제 시험 보는 단어 목록
  const [number, setNumber] = useState(0); // 현재 문제 번호
  const [myInput, setMyInput] = useState(""); // 사용자가 입력한 답
  const [showCorrect, setShowCorrect] = useState(false); // 정답 시 효과 보여주기
  const [showAnswer, setShowAnswer] = useState(false); // 오답 시 정답 보여주기
  const [score, setScore] = useState(0); // 점수

  useEffect(() => {
    console.log("카테고리 번호를 확인합니다. >> ", categoryNum);
    console.log("튜토리얼을 했나요? ?? ", isTuto);
    if (!isTuto) {
      async function getInfo() {
        const tutorialList = [
          {
            id: 31,
            name: "2",
            contentUrl:
              "https://dbscthumb-phinf.pstatic.net/2157_000_1/20121029221657647_9TQ6Z0TU7.jpg/m51_7_i31.jpg?type=w130_fst&wm=N",
          },
        ];
        setTestList(tutorialList);
        console.log("튜토리얼을 시작합니다. >> ", tutorialList);
        console.log("길이가 어떤데?? >> ", tutorialList.length);
      }
      getInfo();
    } else {
      async function getInfo() {
        const data = await axios.get(
          `/api/words?categoryId=${categoryNum}&isRandom=true`
        );
        setTestList(data.data);
        console.log("data >> ", data.data);
      }
      getInfo();
    }
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
      if (isTuto) setScore(() => nowScore);
      setTimeout(correct, 2000, num);
    } else {
      console.log("틀렸습니다", num);
      setShowAnswer(true);
    }
    if (num === 10 && !showAnswer && !showCorrect) {
      setTimeout(exitTest, 2000); // 결과 페이지로 넘어가야 합니다
    }
  };

  const correct = (num) => {
    console.log("정답효과 종료");
    if (isTuto) setNumber(num);
    setShowCorrect(false);
    document.getElementById("inputBox").value = "";
    if (!isTuto) gotoTest();
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
    finishTest(score);
    console.log("test result >> ", score);
  };

  const gotoTest = () => {
    console.log("튜토리얼을 종료합니다.");
    setNumber(0);
    setShowAnswer(false);
    setShowCorrect(false);
    finishTest(true);
    async function getInfo() {
      const data = await axios.get(
        `/api/words?categoryId=${categoryNum}&isRandom=true`
      );
      setTestList(() => data.data);
      console.log("data >> ", data.data);
    }
    getInfo();
  };

  const tutoText = "수어를 보고 정답 2를 입력해보세요.";
  const defaultText = "정답을 입력해주세요";
  const correctText = "정답입니다";
  const showAnswerText = "정답을 확인해보세요";
  const guide = isTuto
    ? !showAnswer && !showCorrect
      ? defaultText
      : showCorrect
      ? correctText
      : showAnswerText
    : tutoText;

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
            <TestScreen link={testList[number].contentUrl} categoryNum={num} />
          </div>
        </div>
        {correctCircle}
        {showAnswerWord}
      </div>
    );
  }
}
