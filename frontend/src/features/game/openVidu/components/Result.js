import { useNavigate, useLocation } from "react-router-dom";
import axios from "./../../../../common/api/https";

import "./Result.scss";

const Result = () => {
  const { state } = useLocation();
  const result = state;
  console.log(state);
  const myNickname = window.localStorage.getItem("nickname");

  const ranking = result.sort((a, b) => b.score - a.score);
  console.log(ranking);

  const crown = require("../../../../assets/result/crown.png");

  let navigate = useNavigate();

  const exitButtonHandler = async () => {
    const score = ranking.map((it) => {
      if (it.nickname === myNickname) {
        return it.score;
      }
    });
    try {
      const data = await axios.put(`/api/user/game/${score}`, {
        experience: score,
      });
      console.log("경험치를 성공적으로 전달했습니다.", data);
    } catch {
      console.log("경험치 넘기기 실패");
    }
    navigate("/");
  };

  const correctCircle = (
    <div class="">
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
    </div>
  );

  return (
    <div className="resultContainer">
      <h1 className="resultGameTitle">게임 결과</h1>
      <div className="resultBox">
        <div className="rankingBox">
          {ranking.map((it) => (
            <div className="rankingItem">
              <div
                className="rankingCrown"
                style={{
                  visibility: ranking.indexOf(it) === 0 ? "" : "hidden",
                }}
              >
                <img src={crown} alt="" />
              </div>

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
      <button onClick={exitButtonHandler} className="exitButton">
        나가기
      </button>
      {correctCircle}
    </div>
  );
};

export default Result;
