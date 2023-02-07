// import Timer from "./Timer"
import AnswerVideo from "./AnswerVideo"
import ChatComponent from "./chat/ChatComponent"
import { useState } from "react"

const SideBar = ( props ) => {

    let [gameCnt, setGameCnt] = useState(0)
    
    const toNext = () => {
      setGameCnt(gameCnt += 1)
      console.log("다음 턴이야 >>", gameCnt)
    }
    
    return (
        <div>
          <AnswerVideo
            className="box"
            myId={props.myId}
            playList={props.playList}
            turn={gameCnt % 4}
            toNext={toNext}
          />
          <ChatComponent
            user={props.user}
            chatDisplay={props.chatDisplay}
            close={props.close}
            messageReceived={props.messageReceived}
            gameCnt={gameCnt}
            toNext={toNext}
          />
            {/* <ChatComponent
              user={localUser}
              chatDisplay={ `display: "block"` }
              close={close}
              messageReceived={this.checkNotification}
            /> */}
        </div>
    )
}

export default SideBar

// export default class Sidebar extends Component {
//     constructor(props) {
//       super(props);
//     }
  
//     render() {
//       return (
//         <div className="Sidebar">
//         <Timer />
//         <AnswerVideo />
//           <ChatComponent
//             user={this.props.user}
//             chatDisplay={this.props.chatDisplay}
//             close={this.props.close}
//             messageReceived={this.props.messageReceived}
//           />
//         </div>
//       );
//     }
//   }