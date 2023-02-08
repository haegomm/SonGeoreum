import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom"
import AnswerVideo from "./AnswerVideo"
import ChatComponent from "./chat/ChatComponent"
// import { useState } from "react"

const SideBar = ( props ) => {

  console.log("여기!!!!!!!!!!!!!!!!",props.playerList)
  const [playerList, setPlayerList] = useState(props.playerList)
    // const playerList = props.playerList // props로 받아오기
    const myNicname  = props.myNicname
    let [gameCnt, setGameCnt] =useState(0)
    const questionList = [{name: '농담', contentUrl:"http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20200824/735073/MOV000259232_700X466.mp4"}] // api로 받아오기 / random 12문제 // 
    const [answerWord, setAnswerWord] = useState('')
    const [answerApi, setAnswerApi] = useState('')
    let scoreList = [0, 0, 0, 0]
    const [showAnswer, setShowAnswer] = useState(false)
  
    const navigate = useNavigate()
    const handletheEndGame = (result) => {
      props.theEndGame()
      navigate('result', {state: result})
    }
    
    // useEffect(() => {
    //   getWordList()
    // }, [])
    
    const getWordList = async() => {
      try {
            const response = await axios.get(
              "https://i8b106.p.ssafy.io/api/words",
        );
        console.log("단어리스트를 가지고 왔어요", response.data)
        return response.data
      } catch (err) {
        console.log("단어리스트를 못 가져왔는뎅ㅜ!!!", err)
    }}
    
    const resultScore = () => {
      const result = []
      for (let i = 0; i < 4; i++){
        result.push({
          nickname: playerList[i],
          score: scoreList[i]
        })
      return result
      }
    }

    const changeAnswer = () => {
      setAnswerWord(questionList[gameCnt].name)
      setAnswerApi(questionList[gameCnt].contentUrl)
    }  

    const toNext = () => {
        console.log("다음 문제로 넘어갑니다.")
        setGameCnt(gameCnt++)
        if (gameCnt === 12) {
          handletheEndGame(resultScore())
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
  if (playerList && playerList.length > 0) {
      
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
}
  
  export default SideBar
