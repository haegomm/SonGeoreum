import * as React from "react";
import "./TestAnswer.scss";

export default function TestAnswer({ myInput, answer }) {
  return (
    <div>
      <div className="answerBox">
        <div className="tag wrong">오답</div>
        <div className="value">{myInput}</div>
      </div>
      <div className="answerBox">
        <div className="tag answer">정답</div>
        <div className="value">{answer}</div>
      </div>
    </div>
  );
}
