import { useState, useEffect } from "react";

import axios from "../../../common/api/https";
import MotionTest from "./MotionTest";
import TopCard from "../../../common/card/TopCard";
import loadingGIF from "../../../assets/test_loading.gif";
import "./HandToWord.scss";
import "./confetti.scss";
import "../../../common/card/TestScreen.scss";

export default function WordToHand({ categoryNum, isTuto, finishTest }) {
  const [testList, setTestList] = useState([]);
  const [camReady, setCamReady] = useState();
  const [number, setNumber] = useState(0);
  const [showCorrect, setShowCorrect] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (isTuto) setCamReady(() => true);
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
      }
      getInfo();
    } else {
      async function getInfo() {
        const data = await axios.get(
          `/api/words?categoryId=${categoryNum}&isRandom=true`
        );
        setTestList(data.data);
      }
      getInfo();
    }
  }, []);

  const startCorrect = (word) => {
    if (
      (!isTuto && word === "2") ||
      (document.getElementById("next") === null &&
        word === document.getElementById("topcard").innerText)
    ) {
      document.getElementById("next");
      const num = number + 1;
      setShowCorrect(true);
      setShowAnswer(true);
      if (isTuto) {
        setScore((number) => number + 1);
      }
    }
  };

  const correct = (num) => {
    setNumber(num);
  };

  const next = (num) => {
    if (!isTuto) gotoTest();
    else {
      if (num === 10) {
        exitTest();
      } else {
        setNumber(num);
        setShowAnswer(false);
        setShowCorrect(false);
      }
    }
  };

  const exitTest = () => {
    if (isTuto) {
      setNumber(0);
      setShowAnswer(false);
      finishTest(score);
      setCamReady(false);
    } else {
      setNumber(0);
      setShowAnswer(false);
      setShowCorrect(false);
      finishTest(false);
      setCamReady(false);
    }
  };

  const gotoTest = () => {
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
    }
    getInfo();
  };

  const ready = () => {
    setCamReady(() => true);
  };

  const tutoText = "웹캠이 정상적으로 작동한다면 V(브이)를 표시해주세요";
  const tutoDone = "웹캡 테스트가 완료되었습니다.";
  const defaultText = "제시어를 보고 수어로 표현해보세요";
  const correctText = "정답입니다";
  const showAnswerText = "정답을 확인해보세요";
  const guide = isTuto
    ? showAnswer
      ? showCorrect
        ? correctText
        : showAnswerText
      : defaultText
    : showAnswer
    ? tutoDone
    : tutoText;

  const nextButtonText = isTuto ? "다음 문제" : "시작하기";
  const showAnswerWord =
    testList && testList.length > 0 ? (
      showAnswer ? (
        <div className="flexBox whiteBox">
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
    <MotionTest categoryNum={-1} startCorrect={startCorrect} />
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

  const displayNone = { display: "none" };
  const displayBlock = { display: "flex" };
  const motionScreen = showAnswer ? displayNone : displayBlock;

  const correctCircle = showCorrect ? (
    <div class="">
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
    </div>
  ) : null;

  if (testList && testList.length > 0 && number < testList.length) {
    return (
      <div>
        <div className="motionTestBox">
          <div className="fixedBox">
            <div>{number + 1} / 10</div>
            {buttonShow}
            <button className="fixedButton red" onClick={exitTest}>
              종료
            </button>
          </div>
          <div>{topCardScreen}</div>
          <div className="flexBox">
            <div className="motionTestScreen motionGuideText">
              {guide}
              <div className="canvasText" style={motionScreen}>
                <div className="gifText">
                  <img className="gif" src={loadingGIF} />
                  <div> 로딩중 </div>
                </div>
              </div>
              <div className="flexBox" style={motionScreen}>
                {motionTest}
              </div>
              {showAnswerWord}
            </div>
          </div>
        </div>
        {correctCircle}
      </div>
    );
  }
}
