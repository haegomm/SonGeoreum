import { useLocation } from "react-router-dom";
import "./Result.scss";

const Result = () => {
  const { state } = useLocation();
  const result = state;
  console.log(state);

  const ranking = result.sort((a, b) => b.score - a.score);
  console.log(ranking);

  return (
    <div>
      <h1>✨게임 결과✨</h1>
      <div className="resultBox">
        <div className="rankingBox">
          {ranking.map((it) => (
            <div className="rankingItem">
              <div className="rank">{ranking.indexOf(it) + 1}</div>
              <div className="nickName">{it.nickname}</div>
              <div className="score">경험치: {it.score}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Result;
