import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { getUserInfo } from "../../common/api/authInfo";

import WordLarge from "./learn/WordLarge";
import TextButton from "../../common/button/TextButton";

import "./Study.scss";
import "./FadeIn.scss";
import "../../common/button/TextButton.scss";

import Grid from "@mui/material/Grid";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SelectCategory from "./SelectCategory";

export default function Study() {
  const [mode, setMode] = useState();
  const [categoryNum, setCategoryNum] = useState();
  const [categoryName, setCategoryName] = useState();
  const isLogin = getUserInfo().nickname;

  const navigate = useNavigate();

  const selectedMode = (mode) => {
    setMode(mode);
    if (mode === "실전모드") navigate("/test");
  };

  const selectedCategoryNum = (num) => {
    setCategoryNum(num);
  };

  const resetModeSelect = () => {
    setMode(null);
  };

  const resetCategory = () => {
    setCategoryNum(null);
  };

  const selectedCategoryInfo = (name, isTestable) => {
    setCategoryName(name);
  };

  const selectModeScreen = mode ? (
    <SelectCategory
      mode={"배움모드"}
      selectedCategoryNum={selectedCategoryNum}
      resetModeSelect={resetModeSelect}
      selectedCategoryInfo={selectedCategoryInfo}
    />
  ) : (
    <div className="studyBox fade-in-box">
      <div className="guideText">학습모드를 선택해주세요</div>
      <div>
        <TextButton text={"배움모드"} selectedMode={selectedMode} />
        <TextButton text={"실전모드"} selectedMode={selectedMode} />
      </div>
    </div>
  );

  const modeScreen = (
    <div className="marginTopBox">
      <button className="reselectButton" onClick={() => resetCategory()}>
        <ArrowBackRoundedIcon fontSize="large" />
      </button>
      <WordLarge
        isLogin={isLogin}
        categoryNum={categoryNum}
        categoryName={categoryName}
      />
    </div>
  );

  const modeStart = categoryNum ? modeScreen : selectModeScreen;

  return (
    <Grid container justifyContent="center">
      <Grid item xs={8} sx={{ marginTop: 0 }}>
        <div className="StudyPage">{modeStart}</div>
      </Grid>
    </Grid>
  );
}
