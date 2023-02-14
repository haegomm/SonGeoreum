import * as React from "react";

import "./TestResult.scss";

export default function TestResult({ score, resetTestMode }) {
  const resultTitle = ["당신은 수어 고수", "참 잘했어요", "조금 더 연습해봐요"];
  let num = 0;
  if (score > 8) num = 0;
  else if (score > 2) num = 1;
  else num = 2;

  return (
    <div className="flexBox marginTopBox">
      <div className="resultScreen">
        <div className="compelete">실전모드 완료</div>
        <div>
          <div className="resultImg">
            <img src="https://picsum.photos/70/70" />
            <div className="resultTitle">{resultTitle[num]}</div>
          </div>
        </div>
        <div className="resultText">10문제 중 {score}문제를 맞추었어요!</div>
        <button className="exitButton" onClick={resetTestMode}>
          나가기
        </button>
      </div>
    </div>
  );
}
