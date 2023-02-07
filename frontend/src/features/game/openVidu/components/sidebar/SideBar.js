// import Timer from "./Timer"
import { useState } from "react"
import AnswerVideo from "./AnswerVideo"
import ChatComponent from "./chat/ChatComponent"
// import { useState } from "react"

const SideBar = ( props ) => {

    let gameCnt = 0
    const questionList = [] // api로 받아오기 / random 12문제 // 
    const [answerWord, setAnswerWord] = useState('')
    const [answerApi, setAnswerApi] = useState('')
    const playList = props.playList // props로 받아오기
    let scoreList = [0, 0, 0, 0]
    // const [whoGetScore, setWhoGetScore] = useState('')
    const [showAnswer, setShowAnswer] = useState(false)
  
    const changeAnswer = () => {
      setAnswerWord(questionList[gameCnt].name) // 단어 이름
      setAnswerApi(questionList[gameCnt].api)
    }  

    const toNext = () => {
      gameCnt++
      onShowAnswer()
      changeAnswer()
      console.log("다음 턴이야 >>", gameCnt)
  }
  
    const onShowAnswer = () => {
      setShowAnswer(!showAnswer)
    }

    const whoGetScore = (who) => {
      let Idx = playList.indexOf(who)
      scoreList[Idx] += 1
      onShowAnswer() // 5초 뒤에 toNext실행
      toNext() 
    }


    // let [gameCnt, setGameCnt] = useState(0)
    
    // const toNext = () => {
    //   setGameCnt(gameCnt += 1)
    //   console.log("다음 턴이야 >>", gameCnt)
    // }
    
    return (
        <div>
          {/* <Timer /> */}
          <AnswerVideo
            className="box"
            myId={props.myId}
            answerWord={answerWord}
            answerApi={answerApi}
            presenter={playList[gameCnt % 4]} // gameCnt % 4 정수로 담기나?
            showAnswer={showAnswer} // 
            onShowAnswer={onShowAnswer}
            toNext={toNext}
          />
          <ChatComponent
            user={props.user}
            chatDisplay={props.chatDisplay}
            close={props.close}
            messageReceived={props.messageReceived}
            gameCnt={gameCnt}
            whoGetScore={whoGetScore}
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