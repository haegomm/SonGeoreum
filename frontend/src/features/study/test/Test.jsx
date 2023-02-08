import { useState } from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import SelectCategory from "../SelectCategory";
import SelectTestMode from "./SelectTestMode";
import HandToWord from "./HandToWord";
import WordToHand from "./WordToHand";

import { Grid } from "@mui/material";

export default function Test() {
  const [categoryNum, setCategoryNum] = useState(); // 선택한 카테고리 번호
  const [categoryName, setCategoryName] = useState(""); // 선택한 카테고리 이름
  const [categoryTestable, setCategoryTestable] = useState(true); // 선택한 카테고리 모션인식 유무
  const [testMode, setTestMode] = useState(); // 테스트 모드

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

  const resetTestMode = () => {
    console.log("reset test mode ");
    setTestMode(null);
  };

  const testModeSelect = categoryNum ? (
    <div className="studyBox">
      <button className="reselectButton" onClick={() => resetCategory()}>
        <ArrowBackRoundedIcon fontSize="large" />
      </button>
      <div className="modeText">
        <div>{categoryName}</div>
      </div>
      <div className="guideText">실전 방법을 선택해주세요</div>
      <div className="studyBox">
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
      <HandToWord categoryNum={categoryNum} resetTestMode={resetTestMode} />
    ) : (
      <WordToHand categoryNum={categoryNum} resetTestMode={resetTestMode} />
    );

  const testStart = testMode ? testScreen : testModeSelect;

  return (
    <Grid container justifyContent="center">
      <Grid item xs={8} sx={{ marginTop: 0 }}>
        {testStart}
      </Grid>
    </Grid>
  );
}
