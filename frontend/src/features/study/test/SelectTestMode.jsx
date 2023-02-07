import { useState, useEffect } from "react";
import axios from "axios";

import { Button } from "@mui/material";

export default function Test({ num, able }) {
  const [wordList, setWordList] = useState(); // 단어 목록
  const [mode, setMode] = useState(); // 테스트 모드 저장

  const categoryNum = num;
  console.log(categoryNum, able);
  let isTestable = true;
  if (able === "false") isTestable = false;
  else isTestable = true;

  useEffect(() => {
    async function getInfo() {
      const data = await axios.get(
        `https://i8b106.p.ssafy.io/api/words/category/${categoryNum}`
      );
      setWordList(data.data);
      console.log(data.data);
    }
    getInfo();
  }, []);

  const selectedMode = (mode) => {
    console.log("switch", mode);
    setMode(mode);
  };

  return (
    <div className="TestPage">
      <div>
        <Button
          variant="contained"
          onClick={() => selectedMode("handToWord")}
          color="blue"
          style={{
            width: 256,
            height: 108,
            borderRadius: 20,
            fontSize: 32,
            fontWeight: 700,
            color: "white",
            margin: 16,
          }}
        >
          수어를 단어로
        </Button>
        <Button
          variant="contained"
          onClick={() => selectedMode("wordToHand")}
          color="blue"
          disabled={!isTestable}
          style={{
            width: 256,
            height: 108,
            borderRadius: 20,
            fontSize: 32,
            fontWeight: 700,
            color: "white",
            margin: 16,
          }}
        >
          단어를 수어로
        </Button>
        {/* 이 버튼을 누르면 테스트 페이지로 넘어가도록 이어서.. */}
      </div>
    </div>
  );
}
