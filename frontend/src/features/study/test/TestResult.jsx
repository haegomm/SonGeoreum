import * as React from "react";

import "./TestResult.scss";

export default function TestResult({ score, resetTestMode }) {
  return (
    <div className="resultScreen">
      <div className="">결과창입니다. 얻는 점수는 : {score}</div>
      <button onClick={resetTestMode}>나가기</button>
    </div>
  );
}
