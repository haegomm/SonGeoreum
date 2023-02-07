import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import CategoryButton from "../../common/button/CategoryButton";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import axios from "axios";

export default function SelectCategory({
  mode,
  selectedCategoryNum,
  resetModeSelect,
  selectedCategoryInfo,
}) {
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

  const navigate = useNavigate();

  const resetMode = () => {
    console.log("모드를 초기화합니다.");
    if (mode === "실전 모드") navigate("/study");
    else resetModeSelect();
  };

  const selectedCategory = (num) => {
    console.log("category", num);
    setCategoryNum(num);
    selectedCategoryNum(num);
    selectedCategoryInfo(
      categoryList[num - 1].name,
      categoryList[num - 1].isTestable
    );
  };

  return (
    <div className="studyBox">
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
            disable={category.isTestable}
            selectedCategory={selectedCategory}
          />
        ))}
      </div>
    </div>
  );
}
