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

  const [categoryNum, setCategoryNum] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [categoryTestable, setCategoryTestable] = useState(true);
  const [testMode, setTestMode] = useState();
  const [isHandTuto, setIsHandTuto] = useState();
  const [isTextTuto, setIsTextTuto] = useState();
  const [testDone, setTestDone] = useState(false);
  const [score, setScore] = useState(0);

  const isLogin = getUserInfo().nickname;

  useEffect(() => {
    if (result) {
      const num = result[0];
      setCategoryNum(num);
      const name = result[1];
      setCategoryName(name);
    }
  }, []);

  const selectedCategoryNum = (num) => {
    setCategoryNum(num);
  };

  const resetCategory = () => {
    setCategoryNum(null);
  };

  const selectedCategoryInfo = (name, isTestable) => {
    setCategoryName(name);
    if (isTestable === "true") setCategoryTestable(true);
    else setCategoryTestable(false);
  };

  const selectedTestMode = (mode) => {
    setTestMode(mode);
  };

  const finishTest = (score) => {
    setTestDone(true);
    setScore(score);
    if (score > 0 && isLogin) {
      async function putScore() {
        const data = await axios.put(`/api/user/game/${score}`, {
          experience: score,
        });
        window.localStorage.setItem("level", data.data.level);
        window.localStorage.setItem("experience", data.data.experience);
      }
      putScore();
    }
  };

  const finishHandTuto = (status) => {
    if (status === false) {
      setTestMode(null);
    } else {
      setTestDone(false);
      setIsHandTuto((isHandTuto) => !isHandTuto);
    }
  };

  const finishTextTuto = (status) => {
    if (status === false) {
      setTestMode(null);
    } else {
      setTestDone(false);
      setIsTextTuto((isHandTuto) => !isHandTuto);
    }
  };

  const resetTestMode = () => {
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
          categoryInfo={categoryName}
          isTuto={true}
          finishTest={finishTest}
        />
      ) : (
        <HandToWord
          categoryNum={categoryNum}
          categoryInfo="튜토리얼"
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
