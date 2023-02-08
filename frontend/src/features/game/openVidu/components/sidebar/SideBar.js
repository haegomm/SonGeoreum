import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom"
import AnswerVideo from "./AnswerVideo"
import ChatComponent from "./chat/ChatComponent"

const SideBar = ( props ) => {

    // const [playerList, setPlayerList] = useState()
    const playerList = props.playerList
    const myNicname  = props.myNicname
    let [gameCnt, setGameCnt] =useState(0)
    const [questionList, setQuestionList] = useState() // api로 받아오기 / random 12문제 // 
    // const [answerWord, setAnswerWord] = useState('')
    // const [answerApi, setAnswerApi] = useState('')
    let scoreList = [0, 0, 0, 0]
    const [showAnswer, setShowAnswer] = useState(false)
  
    const navigate = useNavigate()

    const handletheEndGame = (result) => {
      props.theEndGame()
      navigate('result', {state: result})
    }
    
    useEffect(() => {
      getWordList()
      // setPlayerList(props.playerList)
    }, [])
    
    const getWordList = async() => {
      try {
            const response = await axios.get(
              "https://i8b106.p.ssafy.io/api/words?isRandom=true&isTestable=false&num=12",
        );
        console.log("단어리스트를 가지고 왔어요", response.data)
        setQuestionList(response.data)
        console.log("문제들이야!!!!", questionList)
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
      // setAnswerWord(questionList[gameCnt].name)
      // setAnswerApi(questionList[gameCnt].contentUrl)
      console.log("다음 문제", questionList[gameCnt].name)
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
        setTimeout(() => { toNext() }, 5000)
      }
  if (playerList && playerList.length > 0) {
      
    return (
      <div>
          <AnswerVideo
            className="box"
            myNicname={myNicname}
            // answerWord={answerWord}
            // answerApi={answerApi}
            answerWord={questionList[gameCnt].name}
            answerApi={questionList[gameCnt].contentUrl}
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
            // answerWord={answerWord}
            answerWord={questionList[gameCnt].name}
            whoGetScore={whoGetScore}
            />
        </div>
    )
  }
}
  
  export default SideBar
