import Timer from "./timer"
import AnswerVideo from "./AnswerVideo"
import { useState } from "react"

const SideBar = (myId, playList) => {
    // console.log(props)
    
    const playList = props.playList
    const myId = props.myId

    const [ presenter, setPresenter ] = useState(0)
    const [ showAnswer, setShowAnswer ] = useState(false)
    let gameCnt = 0

    // toNext 호출 => 정답 or 타입아웃 // !show, gamecnt + 1, presenter change 되야함
    // 문제도 다음 문제로 넘어가야함(단어, API)
    const toNext = () => {
        gameCnt += 1
        const idx = gameCnt % 4
        setPresenter(playList(idx))
        setShowAnswer(!showAnswer)
    }

    return (
        <div className="sidebar">
            <Timer toNext={toNext}/>
            <div className="box">answer</div>
            <AnswerVideo myId={myId} presenter={presenter} showAnswer={showAnswer}/>
        </div>
    )

}

export default SideBar