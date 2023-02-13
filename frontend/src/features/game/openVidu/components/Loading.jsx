import axios from "../../../../common/api/https";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SpinnerCircular } from "spinners-react";
import "./Loading.scss";

const Loading = (props) => {
  const navigate = useNavigate();

  const sessionId = props.sessionId;
  const subscribers = props.subscribers;

  const [tipNumber, setTipNumber] = useState(0);
  const tips = [
    "농인들에겐 제 1의 언어가 수어입니다😊",
    "농인들 문화에는 '얼굴이름'이라는 것이 있어요😉",
    "본 게임은 마이크 기능을 제공하지 않습니다. 표정과 몸짓 손짓으로 문제를 표현해봐요🤗",
    "농인들만의 문화가 있어요. 궁금하시다면 게임이 끝난 후 알아보기를 이용해보세요!😘",
  ];

  // Mount시 setTips 실행
  useEffect(() => {
    try {
      const changeTips = setInterval(() => {
        setTipNumber((prev) => (prev + 1) % tips.length);
        // console.log(tipNumber);
        // console.log("현재 보여주는 tip 번호는 " + tipNumber + " 입니다");
      }, 3000);
      return () => clearInterval(changeTips);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const roomOut = async () => {
    // props.leaveSession();
    try {
      const response = await axios.post("/api/game/session/user", {
        sessionId: sessionId,
      });
      console.log("나갈게~ >>", sessionId);
      navigate("/");
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.log("못나가^^ >>", err);
      navigate("/");
    }
  };

  return (
    <div id="LoadingBox">
      <button className="loadingButton fixedButton" onClick={() => roomOut()}>
        나가기
      </button>
      <div>
        <SpinnerCircular
          size={120}
          thickness={180}
          speed={100}
          color="rgba(57, 82, 172, 1)"
          secondaryColor="rgba(57, 78, 172, 0.22)"
          className="gameLoadingSpinner"
        />
      </div>
      <div className="loadingTitleBox">
        <h2>곧 게임이 시작됩니다</h2>
      </div>
      <div className="waitingListBox">
        <h1>4명 중 {subscribers.length + 1}명이 모였습니다</h1>
      </div>
      <div className="tipBox">
        <h4>tip : {tips[tipNumber]}</h4>
      </div>
    </div>
  );
};

export default Loading;
