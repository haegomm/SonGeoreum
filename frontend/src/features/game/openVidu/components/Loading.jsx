import React, { Component } from "react";
import { SpinnerCircular } from "spinners-react";

export default class ChatComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tipNumber: 0, // 현재 보여주고 있는 tip 번호
      tips: [
        "다같이 정답을 보면서 수어를 따라해 보세요1",
        "다같이 정답을 보면서 수어를 따라해 보세요2",
        "다같이 정답을 보면서 수어를 따라해 보세요3",
        "다같이 정답을 보면서 수어를 따라해 보세요4",
      ],
    };
  }

  componentDidMount() {
    // this.ChangeTips();
  }

  // ChangeTips() {
  //   const nextNumber = 0;
  //   setInterval(() => {
  //     try {
  //       const nowNumber = this.state.tipNumber;
  //       this.state.tipNumber = (nowNumber + 1) % this.state.tips.length;
  //       console.log(
  //         "현재 보여주는 tip 번호는 " + this.state.tipNumber + " 입니다"
  //       );
  //       this.setState({ tipNumber: this.state.tipNumber });
  //     } catch (err) {}
  //   }, 4000);
  // }

  render() {
    return (
      <div id="LoadingBox">
        로딩화면 테스트
        <button>나가기버튼</button>
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
        <div>{this.state.tips[this.state.tipNumber]}</div>
      </div>
    );
  }
}
