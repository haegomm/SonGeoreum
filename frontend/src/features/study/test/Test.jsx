import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { getUserInfo } from "../../../common/api/authInfo";

import axios from "../../../common/api/https";
import SelectCategory from "../SelectCategory";
import SelectTestMode from "./SelectTestMode";
import HandToWord from "./HandToWord";
import WordToHand from "./WordToHand";
import TestResult from "./TestResult";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Grid } from "@mui/material";

export default function Test() {
  const location = useLocation();
  const result = location.state;
  console.log("단어장에서 테스트로 넘어왔나요?? >>", result);

  const [categoryNum, setCategoryNum] = useState(); // 선택한 카테고리 번호
  const [categoryName, setCategoryName] = useState(""); // 선택한 카테고리 이름
  const [categoryTestable, setCategoryTestable] = useState(true); // 선택한 카테고리 모션인식 유무
  const [testMode, setTestMode] = useState(); // 테스트 모드
  const [isHandTuto, setIsHandTuto] = useState(); // 모션인식 튜토리얼 완료 여부
  const [isTextTuto, setIsTextTuto] = useState(); // 텍스트 입력 튜토리얼 완료 여부
  const [testDone, setTestDone] = useState(false); // 테스트 종료 여부
  const [score, setScore] = useState(0); // 얻은 점수

  const isLogin = getUserInfo().nickname;
  console.log("로그인된 상태인가요? >>", isLogin);
  console.log("튜토리얼을 마쳤나요? >>", isTextTuto);

  useEffect(() => {
    if (result) {
      const num = result[0];
      setCategoryNum(num);
      const name = result[1];
      setCategoryName(name);
    }
  }, []);

  const selectedCategoryNum = (num) => {
    console.log("selected category number >> ", num);
    setCategoryNum(num);
  };

  const resetCategory = () => {
    console.log("카테고리를 초기화합니다.");
    setCategoryNum(null);
  };

  const selectedCategoryInfo = (name, isTestable) => {
    console.log(name, isTestable);
    setCategoryName(name);
    if (isTestable === "true") setCategoryTestable(true);
    else setCategoryTestable(false);
  };

  const selectedTestMode = (mode) => {
    console.log("selected test mode >> ", mode);
    setTestMode(mode);
  };

  const finishTest = (score) => {
    console.log("finish test");
    setTestDone(true);
    setScore(score);
    if (score > 0 && isLogin) {
      console.log("점수를 입력합니다");
      async function putScore() {
        const data = await axios.put(`/api/user/game/${score}`, {
          experience: score,
        });
        console.log(data);
      }
      putScore();
    }
  };

  const finishHandTuto = (status) => {
    console.log(status);
    if (status === false) {
      console.log("테스트창으로 돌아가야함");
      setTestMode(null);
    } else {
      console.log("finish hand tuto");
      setTestDone(false);
      setIsHandTuto((isHandTuto) => !isHandTuto);
    }
  };

  const finishTextTuto = (status) => {
    console.log(status);
    if (status === false) {
      console.log("테스트창으로 돌아가야함");
      setTestMode(null);
    } else {
      console.log("finish text tuto");
      setTestDone(false);
      setIsTextTuto((isHandTuto) => !isHandTuto);
    }
  };

  const resetTestMode = () => {
    console.log("reset test mode ");
    setTestMode(null);
    setTestDone(false);
  };

  const testModeSelect = categoryNum ? (
    <div className="studyBox">
      <button className="reselectButton" onClick={() => resetCategory()}>
        <ArrowBackRoundedIcon fontSize="large" />
      </button>
      <div className="modeText  fade-in-box">
        <div>{categoryName}</div>
      </div>
      <div className="guideText  fade-in-box">실전 방법을 선택해주세요</div>
      <div className="studyBox  fade-in-up">
        <SelectTestMode
          num={categoryNum}
          able={categoryTestable}
          selectedTestMode={selectedTestMode}
        />
      </div>
    </div>
  ) : (
    <SelectCategory
      mode="실전 모드"
      selectedCategoryNum={selectedCategoryNum}
      selectedCategoryInfo={selectedCategoryInfo}
    />
  );

  const testScreen =
    testMode && testMode === "handToWord" ? (
      isTextTuto ? (
        <HandToWord
          categoryNum={categoryNum}
          isTuto={true}
          finishTest={finishTest}
        />
      ) : (
        <HandToWord
          categoryNum={categoryNum}
          isTuto={false}
          finishTest={finishTextTuto}
        />
      )
    ) : isHandTuto ? (
      <WordToHand
        categoryNum={categoryNum}
        isTuto={true}
        finishTest={finishTest}
      />
    ) : (
      <WordToHand
        categoryNum={categoryNum}
        isTuto={false}
        finishTest={finishHandTuto}
      />
    );

  const testStart = testMode ? testScreen : testModeSelect;
  const test = testDone ? (
    <TestResult score={score} resetTestMode={resetTestMode} />
  ) : (
    testStart
  );

  return (
    <Grid container justifyContent="center">
      <Grid item xs={8} sx={{ marginTop: 0 }}>
        {test}
      </Grid>
    </Grid>
  );
}
