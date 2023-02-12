import { useState, useEffect } from "react";

import axios from "../../../common/api/https";
import MotionTest from "./MotionTest";
import TopCard from "../../../common/card/TopCard";

import "./HandToWord.scss";
import "../../../common/card/TestScreen.scss";

export default function WordToHand({ categoryNum, isTuto, finishTest }) {
  const [testList, setTestList] = useState([]); // 실제 시험 보는 단어 목록
  const [camReady, setCamReady] = useState(); // 웹캠 준비 완료
  const [number, setNumber] = useState(0); // 현재 문제 번호
  const [showCorrect, setShowCorrect] = useState(false); // 정답 시 효과 보여주기
  const [showAnswer, setShowAnswer] = useState(false); // 오답 시 정답 보여주기
  const [score, setScore] = useState(0); // 점수
  console.log("리렌더링 테스트", categoryNum);

  useEffect(() => {
    if (isTuto) setCamReady(() => true);
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

  const startCorrect = (word) => {
    console.log("나와라", showAnswer);
    console.log(" 상태", document.getElementById("next"));
    if (
      (!isTuto && word === "2") ||
      (document.getElementById("next") === null &&
        word === document.getElementById("topcard").innerText)
    ) {
      document.getElementById("next");
      const num = number + 1;
      console.log("정답입니다", num);
      setShowCorrect(true);
      setShowAnswer(true);
      if (isTuto) {
        setScore((number) => number + 1);
      }
    }
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
    if (!isTuto) gotoTest();
    else {
      if (num === 10) {
        exitTest(); // 결과 페이지로 넘어가야 합니다
      } else {
        console.log("다음 문제로 넘어갑니다");
        setNumber(num);
        setShowAnswer(false);
        setShowCorrect(false);
      }
    }
  };

  const exitTest = () => {
    if (isTuto) {
      console.log("테스트를 종료합니다.");
      setNumber(0);
      setShowAnswer(false);
      // setShowCorrect(false);
      finishTest(score);
      setCamReady(false);
      console.log("test result >> ", score);
    } else {
      console.log("튜토리얼 중도에 종료합니다.");
      setNumber(0);
      setShowAnswer(false);
      setShowCorrect(false);
      finishTest(false);
      setCamReady(false);
    }
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
      ready();
      console.log("data >> ", data.data);
    }
    getInfo();
  };

  const ready = () => {
    console.log("카메라가 준비되었습니다");
    setCamReady(() => true);
  };

  const tutoText = "웹캠이 정상적으로 작동한다면 V(브이)를 표시해주세요";
  const defaultText = "제시어를 보고 수어로 표현해보세요";
  const correctText = "정답입니다";
  const showAnswerText = "정답을 확인해보세요";
  const guide = isTuto
    ? showAnswer
      ? showCorrect
        ? correctText
        : showAnswerText
      : defaultText
    : tutoText;

  const nextButtonText = isTuto ? "다음 문제" : "START";
  const showAnswerWord =
    testList && testList.length > 0 ? (
      showAnswer ? (
        <div className="flexBox">
          <img
            className="answerImage"
            src={testList[number].contentUrl}
            referrerPolicy="no-referrer"
          />
          <button id="next" className="green" onClick={() => next(number + 1)}>
            {nextButtonText}
          </button>
        </div>
      ) : null
    ) : null;

  const motionTest = isTuto ? (
    camReady ? (
      <MotionTest
        // word={testList[number].name}
        categoryNum={categoryNum}
        startCorrect={startCorrect}
      />
    ) : null
  ) : (
    <MotionTest
      // word={testList[number].name}
      categoryNum={-1}
      startCorrect={startCorrect}
    />
  );

  const buttonShow = showAnswer ? null : (
    <button className="fixedButton yellow" onClick={() => setShowAnswer(true)}>
      PASS
    </button>
  );

  const topCardScreen =
    isTuto && testList && testList.length > 0 && camReady ? (
      <TopCard text={testList[number].name} />
    ) : showCorrect ? (
      <TopCard text={"준비 완료"} color="green" />
    ) : (
      <TopCard text={"테스트 준비"} />
    );

  const camScreen = camReady ? motionTest : null;

  const correctCircle = showCorrect ? null : null; // 이부분에 정답 효과를 넣습니다.

  if (testList && testList.length > 0 && number < testList.length) {
    return (
      <div>
        <div className="motionTestBox">
          <div className="fixedBox">
            <div>{number} / 10</div>
            {buttonShow}
            <button className="fixedButton red" onClick={exitTest}>
              종료
            </button>
          </div>
          <div>{topCardScreen}</div>
          <div className="flexBox">
            <div className="testScreen motionGuideText">
              {guide}
              {/* 아래 텍스트 대신에 로딩중 gif를 넣으면 좋을 것 같아요~~ */}
              <div className="canvasText">잠시 후 테스트가 시작됩니다.</div>
              <div className="flexBox">{motionTest}</div>
              {showAnswerWord}
            </div>
          </div>
        </div>
        {correctCircle}
      </div>
    );
  }
}
