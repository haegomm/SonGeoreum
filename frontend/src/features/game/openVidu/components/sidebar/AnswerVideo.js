import React, { useEffect, useState } from "react";
import lock from "../../assets/images/lock.jpg"

const AnswerVideo = (props) => {

    const myId = props.myId
    // const playerList = props.playerList
    const playerList = [1,2,3,4]
    const Idx = props.turn

    console.log("뭐가 문제일까....", myId, playerList, Idx)

    let [showVideo, setShowVideo] = useState(false)
    let [ timerCount, setTimerCount ] = useState(5)
    
    const handleToNext = () => {
        console.log("다음 턴으로 넘어가보자")
        props.toNext()
    }
    
    useEffect(() => {
      startTimer()
    }, [])
    
    // Timer
    const startTimer = () => {
        if(!showVideo){
            const timer = setInterval(() => {
                setTimerCount( timerCount => timerCount - 1)
            }, 1000)
            if (timerCount === 0) {
                setShowVideo(!showVideo)
                handleToNext()
                clearInterval(timer)
            }
            return () => clearInterval(timer)
        }
    }

    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         setTimerCount( timerCount => timerCount - 1)
    //     }, 1000)
    //     if (timerCount === 0) {
    //         setShowVideo(!showVideo)
    //         handleToNext()
    //         clearInterval(timer)
    //     }
    //     return () => clearInterval(timer)
    //     }, [timerCount])

    return (
        <div>
            <div className="box">
                <h1>{ timerCount }</h1>
            </div>
            <div className="box">
                {showVideo || playerList[Idx] === myId  ? (
                    <div className="box">
                        {/* <div className="box">answer</div> */}
                        {/* 나중에 loop속성 넣어서 동영상 반복 재생시키기 */}
                        <video autoPlay>
                            <source src="http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20200824/735073/MOV000259232_700X466.mp4"></source>
                        </video>
                    </div>
                ) : (
                <div className="box">
                    {/* <div className="box">answer</div> */}
                    <img className="box" src={lock}></img>
                </div>
                    )}
            </div>
        </div>
    )
}

export default AnswerVideo