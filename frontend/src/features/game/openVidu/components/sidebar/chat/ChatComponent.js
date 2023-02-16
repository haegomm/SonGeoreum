import React, { Component } from "react";
import { Fab } from "@mui/material";
import Send from "@mui/icons-material/Send";

import "./ChatComponent.css";
import { Tooltip } from "@mui/material";

export default class ChatComponent extends Component {
  constructor(props) {
    super(props);

    console.log("채팅 프롭스 확인", props);

    this.state = {
      messageList: [],
      message: "",
      checkMessageList: [], // 정답 찾기 위해 만든 임시 생성 배열
      // questionList: props.questionList,
      // chatAnswerCnt: 0,
      // getScore: false,
    };

    this.chatScroll = React.createRef();

    this.handleChange = this.handleChange.bind(this);
    this.handlePressKey = this.handlePressKey.bind(this);
    this.close = this.close.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    // this.handleWhoGetScore = this.handleWhoGetScore.bind(this);
  }

  componentDidMount() {
    this.props.user
      .getStreamManager()
      .stream.session.on("signal:chat", (event) => {
        const data = JSON.parse(event.data);
        let messageList = this.state.messageList;
        messageList.push({
          connectionId: event.from.connectionId,
          nickname: data.nickname,
          message: data.message,
        });

        // 정답 체크용 배열 (턴마다 초기화 됨)
        // let checkMessageList = this.state.checkMessageList;
        // checkMessageList.push({
        //   nickname: JSON.stringify(data.nickname).replace(/\"/g, ""),
        //   message: JSON.stringify(data.message).replace(/\"/g, ""),
        // });
        // this.checkMessage(checkMessageList); // 정답 체크해보자

        // const document = window.document;
        // setTimeout(() => {
        //   const userImg = document.getElementById(
        //     "userImg-" + (this.state.messageList.length - 1)
        //   );
        //   const video = document.getElementById("video-" + data.streamId);
        //   // const avatar = userImg.getContext("2d");
        //   // avatar.drawImage(video, 200, 120, 285, 285, 0, 0, 60, 60);
        //   this.props.messageReceived();
        // }, 50);
        this.setState({ messageList: messageList });
        this.scrollToBottom();
        this.props.checkAnswer(data.nickname, data.message);
      });
  }

  componentWillUnmount() {
    clearInterval(this.changeChatAnswerCnt);
  }

  // 메시지 체크하여 정답 찾는 함수
  checkMessage(checkList) {
    // console.log(checkList);
    checkList.map((item, idx) => {
      // const nowWord = JSON.stringify(item.message).replace(/\"/g, "");
      // const nowNickname = JSON.stringify(item.nickname);
      const word = item.message;
      const nickname = item.nickname;
      console.log(
        "정답 단어",
        this.state.questionList[this.state.chatAnswerCnt].name
      );
      console.log("게임 횟수", this.state.chatAnswerCnt);
      console.log("입력한 단어: " + word);
      if (
        word ===
        (this.state.chatAnswerCnt === 12 || this.state.getScore
          ? "null"
          : this.state.questionList[this.state.chatAnswerCnt].name)
      ) {
        console.log("정답입니다.");
        console.log("정답자: " + nickname);
        // 정답자 올려주기
        this.setState({
          getScore: true,
        });
        this.props.whoGetScore(nickname);
        this.state.checkMessageList = []; // 정답을 체크했으니 초기화 해준다. //setState?
      } else {
        console.log("틀렸습니다.");
      }
      console.log(
        "현재 체크할 메시지 리스트 사이즈 : " +
          this.state.checkMessageList.length
      );
    });
  }

  // 정답자 올려주기 // nickname let에 담아서 보내줘야하나? / this.props.nickname
  handleWhoGetScore(nickname) {
    console.log("얘가 정답자야!!", nickname.props.user.nickname);
    this.props.whoGetScore(nickname.props.user.nickname);
  }

  handleChange(event) {
    this.setState({ message: event.target.value });
  }

  handlePressKey(event) {
    if (event.key === "Enter") {
      this.sendMessage();
    }
  }

  sendMessage() {
    console.log(this.state.message);
    if (this.props.user && this.state.message) {
      let message = this.state.message.replace(/ +(?= )/g, "");
      if (message !== "" && message !== " ") {
        const data = {
          message: message,
          nickname: this.props.user.getNickname(),
          streamId: this.props.user.getStreamManager().stream.streamId,
        };
        this.props.user.getStreamManager().stream.session.signal({
          data: JSON.stringify(data),
          type: "chat",
        });
      }
    }
    this.setState({ message: "" });
  }

  scrollToBottom() {
    setTimeout(() => {
      try {
        this.chatScroll.current.scrollTop =
          this.chatScroll.current.scrollHeight;
      } catch (err) {}
    }, 20);
  }

  close() {
    this.props.close(undefined);
  }

  render() {
    const styleChat = { display: "block" };
    return (
      <div id="chatContainer">
        <div id="chatComponent">
          {/* <div id="chatToolbar"> */}
          {/* <span> */}
          {/* {this.props.user.getStreamManager().stream.session.sessionId} - */}
          {/* 채팅하기 */}
          {/* </span> */}
          {/* <IconButton id="closeButton" onClick={this.close}>
                            <HighlightOff color="secondary" />
                        </IconButton> */}
          {/* </div> */}
          <div className="message-wrap" ref={this.chatScroll}>
            {this.state.messageList.map((data, i) => (
              <div
                key={i}
                id="remoteUsers"
                className={
                  "message" +
                  (data.connectionId !== this.props.user.getConnectionId()
                    ? " left"
                    : " right")
                }
              >
                {/* <canvas
                  id={"userImg-" + i}
                  width="60"
                  height="60"
                  className="user-img"
                /> */}
                <div className="msg-detail">
                  <div className="msg-info">
                    <p> {data.nickname}</p>
                  </div>
                  <div className="msg-content">
                    <span className="triangle" />
                    <p className="text">{data.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div id="messageInput">
            <input
              placeholder="메시지를 작성하세요"
              id="chatInput"
              value={this.state.message}
              onChange={this.handleChange}
              onKeyPress={this.handlePressKey}
            />
            <Tooltip title="Send message">
              <Fab size="small" id="sendButton" onClick={this.sendMessage}>
                <Send />
              </Fab>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }
}
