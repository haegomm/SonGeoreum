import axios from "../../../../common/api/https";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SpinnerCircular } from "spinners-react";

const Loading = (props) => {
  const navigate = useNavigate();

  const sessionId = props.sessionId;
  const subscribers = props.subscribers;

  let tipNumber = 0;
  const tips = [
    "다같이 정답을 보면서 수어를 따라해 보세요1",
    "다같이 정답을 보면서 수어를 따라해 보세요2",
    "다같이 정답을 보면서 수어를 따라해 보세요3",
    "다같이 정답을 보면서 수어를 따라해 보세요4",
  ];

  // Mount시 setTips 실행
  useEffect(() => {
    try {
      const changeTips = setInterval(() => {
        tipNumber = (tipNumber + 1) % tips.length;
        // console.log(tipNumber)
        // console.log("현재 보여주는 tip 번호는 " + tipNumber + " 입니다")
      }, 3000);
      return () => clearInterval(changeTips);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const roomOut = async () => {
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
    }
  };

  return (
    <div id="LoadingBox">
      <h1>로딩화면 테스트</h1>
      <button onClick={() => roomOut()}>나가기버튼</button>
      <div>
        <SpinnerCircular
          size={90}
          thickness={180}
          speed={100}
          color="rgba(57, 82, 172, 1)"
          secondaryColor="rgba(57, 78, 172, 0.22)"
        />
      </div>
      <div>곧 게임이 시작됩니다.</div>
      <div>4 명 중 {subscribers.length + 1} 명이 모였습니다.</div>
      <div>{tips[tipNumber]}</div>
    </div>
  );
};

export default Loading;
