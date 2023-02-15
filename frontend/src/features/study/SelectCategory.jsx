import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "../../common/api/https";
import CategoryButton from "../../common/button/CategoryButton";
import categoryImages from "../../assets/category/categoryImages";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

export default function SelectCategory({
  mode,
  selectedCategoryNum,
  resetModeSelect,
  selectedCategoryInfo,
}) {
  const [categoryList, setCategoryList] = useState([]); // 카테고리 리스트 저장
  const [categoryNum, setCategoryNum] = useState(); // 선택한 카테고리 번호
  const [infiniteCategoryList, setInfiniteCategoryList] = useState([]); // 무한 스크롤에 보여줄 카테고리 리스트
  const [infiniteCount, setInfiniteCount] = useState(1); // 무한 스크롤이 갱신되는 횟수

  const colors = ["yellow", "green", "red"]; // 색깔 목록


  useEffect(() => {
    async function getInfo() {
      const data = await axios.get(`/api/categories`);
      setCategoryList(data.data);
      console.log(data.data);
      setInfiniteCategoryList(data.data);
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
      <div className="modeText fade-in-box">
        <div>{mode}</div>
      </div>
      <div className="guideText fade-in-box">카테고리를 선택해주세요</div>
      <button className="reselectButton" onClick={() => resetMode()}>
        <ArrowBackRoundedIcon fontSize="large" />
      </button>
      <div id = "infiniteScroll" className="categoryList fade-in-up infiniteScroll" onWheel={(event) => {
        let scrollBox = document.getElementById("infiniteScroll");
        // 엘리먼트의 overflow 포함 가로 길이(scrollWidth) * 0.95 <= 엘리먼트의 가로 길이 + 엘리먼트가 왼쪽에서부터 스크롤 된 길이
        if (scrollBox.scrollWidth * 0.95 <= scrollBox.offsetWidth + scrollBox.scrollLeft) {
          let newList = [];
          for (let category of infiniteCategoryList) {
            newList.push(category)
          }

          for (let category of categoryList) {
            let uniqueCategory = JSON.parse(JSON.stringify(category));
            uniqueCategory.id += infiniteCount * categoryList.length;
            newList.push(uniqueCategory)
          }
          setInfiniteCount(infiniteCount => infiniteCount+1);
          setInfiniteCategoryList(newList)
        }
        if (event.deltaY < 0) {
          scrollBox.scrollLeft -= 200
        } else {
          scrollBox.scrollLeft += 200
        }
        }}>
        {infiniteCategoryList.map((category) => (          
          <CategoryButton
            key={category.id}
            text={category.name}
            index={(category.id % categoryList.length == 0) ? categoryList.length : category.id % categoryList.length}
            link={categoryImages[(category.id % categoryList.length == 0) ? categoryList.length-1 : category.id % categoryList.length-1]}
            color={colors[category.id % 3]}
            disable={category.isTestable}
            selectedCategory={selectedCategory}
          />
        ))}

      </div>
    </div>
  );
}
