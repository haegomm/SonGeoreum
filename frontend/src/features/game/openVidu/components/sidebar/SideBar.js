import Timer from "./Timer"
import AnswerVideo from "./AnswerVideo"
import ChatComponent from "./chat/ChatComponent"
import { useState } from "react"

const SideBar = ( props ) => {
    
    const playList = props.playList

    const [ presenter, setPresenter ] = useState(0)
    const [ showAnswer, setShowAnswer ] = useState(false)
    let gameCnt = 0
    
    // toNext 호출 => 정답 or 타입아웃 때 // !show, gamecnt + 1, presenter change 되야함
    // 문제도 다음 문제로 넘어가야함(단어, API)
    const toNext = () => {
        gameCnt += 1
        const idx = gameCnt % 4
        setPresenter(playList(idx))
        setShowAnswer(!showAnswer)
    }
    
    return (
        <div>
            <Timer className="box" toNext={toNext}/>
            <div className="box">answer</div>
            <AnswerVideo className="box" myId={props.myId} presenter={presenter}/>
            <ChatComponent
              user={props.user}
              chatDisplay={props.chatDisplay}
              close={props.close}
              messageReceived={props.messageReceived}
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