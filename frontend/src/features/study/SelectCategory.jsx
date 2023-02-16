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
  const [categoryList, setCategoryList] = useState([]);
  const [categoryNum, setCategoryNum] = useState();
  const [infiniteCategoryList, setInfiniteCategoryList] = useState([]);
  const [infiniteCount, setInfiniteCount] = useState(1);

  const colors = ["yellow", "green", "red"];

  useEffect(() => {
    async function getInfo() {
      const data = await axios.get(`/api/categories`);
      setCategoryList(data.data);
      setInfiniteCategoryList(data.data);
    }
    getInfo();
  }, []);

  const navigate = useNavigate();

  const resetMode = () => {
    if (mode === "실전 모드") navigate("/study");
    else resetModeSelect();
  };

  const selectedCategory = (num) => {
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
      <div
        id="infiniteScroll"
        className="categoryList fade-in-up infiniteScroll"
        onWheel={(event) => {
          let scrollBox = document.getElementById("infiniteScroll");
          if (
            scrollBox.scrollWidth * 0.95 <=
            scrollBox.offsetWidth + scrollBox.scrollLeft
          ) {
            let newList = [];
            for (let category of infiniteCategoryList) {
              newList.push(category);
            }

            for (let category of categoryList) {
              let uniqueCategory = JSON.parse(JSON.stringify(category));
              uniqueCategory.id += infiniteCount * categoryList.length;
              newList.push(uniqueCategory);
            }
            setInfiniteCount((infiniteCount) => infiniteCount + 1);
            setInfiniteCategoryList(newList);
          }
          if (event.deltaY < 0) {
            scrollBox.scrollLeft -= 200;
          } else {
            scrollBox.scrollLeft += 200;
          }
        }}
      >
        {infiniteCategoryList.map((category) => (
          <CategoryButton
            key={category.id}
            text={category.name}
            index={
              category.id % categoryList.length == 0
                ? categoryList.length
                : category.id % categoryList.length
            }
            link={
              categoryImages[
                category.id % categoryList.length == 0
                  ? categoryList.length - 1
                  : (category.id % categoryList.length) - 1
              ]
            }
            color={colors[category.id % 3]}
            disable={category.isTestable}
            selectedCategory={selectedCategory}
          />
        ))}
      </div>
    </div>
  );
}
