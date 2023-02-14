import { useLocation } from "react-router-dom";
import "./Result.scss";

const Result = () => {
  const { state } = useLocation();
  const result = state;
  console.log(state);

  const ranking = result.sort((a, b) => b.score - a.score);
  console.log(ranking);

  return (
    <div className="resultContainer">
      <h1 className="resultGameTitle">✨ 게임 결과 ✨</h1>
      <div className="resultBox">
        <div className="rankingBox">
          {ranking.map((it) => (
            <div className="rankingItem">
              <div className="rank">{ranking.indexOf(it) + 1}등</div>
              <div className="profilePic">
                <img src={it.image} alt="profile" />
              </div>
              <div className="nickName">{it.nickname}</div>
              <div className="score">{it.score}점</div>
            </div>
          ))}
        </div>
      </div>
      <button className="exitButton">나가기</button>
    </div>
  );
};

export default Result;
