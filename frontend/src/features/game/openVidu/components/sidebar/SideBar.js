import { useState } from "react"
import { useNavigate } from "react-router-dom"
import AnswerVideo from "./AnswerVideo"
import ChatComponent from "./chat/ChatComponent"
// import { useState } from "react"

const SideBar = ( props ) => {

    const myNicname  = props.myNicname
    let gameCnt = 0
    const questionList = [] // api로 받아오기 / random 12문제 // 
    const [answerWord, setAnswerWord] = useState('')
    const [answerApi, setAnswerApi] = useState('')
    const playerList = props.playerList // props로 받아오기
    let scoreList = [0, 0, 0, 0]
    const [showAnswer, setShowAnswer] = useState(false)
  
  const navigate = useNavigate()
  const handletheEndGame = () => {
    props.theEndGame()
    navigate('result', {state: {    
      playerList: playerList,
      scoreList: scoreList
    }})
  }

  const changeAnswer = () => {
    setAnswerWord(questionList[gameCnt].name)
    setAnswerApi(questionList[gameCnt].api)
  }  

  const toNext = () => {
      console.log("다음 문제로 넘어갑니다.")
      gameCnt++
      if (gameCnt === 12) {
        handletheEndGame()
      } else {
        onShowAnswer() // false 
        changeAnswer()
        console.log("다음 게임 시작 >>", gameCnt)
      }
  }
  
    const onShowAnswer = () => {
      setShowAnswer(!showAnswer)
      console.log("지금은 영상을 볼 수",showAnswer)
    }

  const whoGetScore = (who) => {
    if (who) {  
      let Idx = playerList.indexOf(who)
      scoreList[Idx] += 1
      }
      onShowAnswer() // true
      console.log("정답 영상을 보여줍니다")
      setTimeout(() => { toNext() }, 5000)
    }
    
    return (
        <div>
          <AnswerVideo
            className="box"
            myNicname={myNicname}
            answerWord={answerWord}
            answerApi={answerApi}
            presenter={playerList[gameCnt % 4]}
            showAnswer={showAnswer} // 
            whoGetScore={whoGetScore}
            toNext={toNext}
          />
          <ChatComponent
            user={props.user}
            chatDisplay={props.chatDisplay}
            close={props.close}
            messageReceived={props.messageReceived}
            answerWord={answerWord}
            whoGetScore={whoGetScore}
          />
        </div>
    )
}

export default SideBar
