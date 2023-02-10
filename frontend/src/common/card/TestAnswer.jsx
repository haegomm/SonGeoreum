import * as React from "react";
import "./TestAnswer.scss";

export default function TestAnswer({ myInput, answer }) {
  return (
    <div className="center">
      <div className="answerBox">
        <div className="tag wrong">오답</div>
        <div className="valueBox">{myInput}</div>
      </div>
      <div className="answerBox">
        <div className="tag answer">정답</div>
        <div className="valueBox">{answer}</div>
      </div>
    </div>
  );
}
