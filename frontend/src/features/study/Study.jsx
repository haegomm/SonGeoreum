import { useState, useEffect } from "react";
import axios from "axios";

import WordLarge from "../../common/card/WordLarge";
import TextButton from "../../common/button/TextButton";
import CategoryButton from "../../common/button/CategoryButton";
import MotionTest from "./test/MotionTest";

import "./Study.scss";
import "../../common/button/TextButton.scss";

import Grid from "@mui/material/Grid";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

export default function Study() {
  const [mode, setMode] = useState(); // 학습 모드 저장
  const [categoryList, setCategoryList] = useState([]); // 카테고리 리스트 저장
  const [categoryNum, setCategoryNum] = useState(); // 선택한 카테고리 번호
  const colors = ["yellow", "green", "red"]; // 색깔 목록

  useEffect(() => {
    async function getInfo() {
      const data = await axios.get(`https://i8b106.p.ssafy.io/api/categories`);
      setCategoryList(data.data);
      console.log(data.data);
    }
    getInfo();
  }, []);

  const selectedMode = (mode) => {
    console.log("switch", mode);
    setMode(mode);
  };

  const resetMode = () => {
    console.log("모드를 초기화합니다.");
    setMode(null);
  };

  const selectedCategory = (num) => {
    console.log("category", num);
    setCategoryNum(num);
  };

  const resetCategory = () => {
    console.log("카테고리를 초기화합니다.");
    setCategoryNum(null);
  };

  const selectModeScreen = mode ? (
    <div className="ST">
      <div className="modeText">
        <div>{mode}</div>
      </div>
      <div className="guideText">카테고리를 선택해주세요</div>
      <button className="reselectButton" onClick={() => resetMode()}>
        <ArrowBackRoundedIcon fontSize="large" />
      </button>
      <div className="categoryList">
        {categoryList.map((category) => (
          <CategoryButton
            key={category.id}
            text={category.name}
            index={category.id}
            link="https://picsum.photos/70/30"
            color={colors[category.id % 3]}
            disable={category.isTesttable}
            selectedCategory={selectedCategory}
          />
        ))}
      </div>
    </div>
  ) : (
    <div className="ST">
      <div className="guideText">학습모드를 선택해주세요</div>
      <div>
        <TextButton text={"배움모드"} selectedMode={selectedMode} />
        <TextButton text={"실전모드"} selectedMode={selectedMode} />
      </div>
    </div>
  );

  const modeScreen =
    mode === "배움모드" ? (
      <div className="">
        <button className="reselectButton" onClick={() => resetCategory()}>
          <ArrowBackRoundedIcon fontSize="large" />
        </button>
        <WordLarge isLogin={true} categoryNum={categoryNum} />
      </div>
    ) : (
      <div className="ST">
        <MotionTest />
      </div>
    );

  const modeStart = categoryNum ? modeScreen : selectModeScreen;

  return (
    <Grid container justifyContent="center">
      <Grid item xs={8} sx={{ marginTop: 0 }}>
        <div className="StudyPage">
          <div className="studyBox">{modeStart}</div>
        </div>
      </Grid>
    </Grid>
  );
}
