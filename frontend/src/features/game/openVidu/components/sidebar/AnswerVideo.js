import React, { useEffect, useState } from "react";
import lock from "../../assets/images/lock.jpg"

const AnswerVideo = (props) => {

    const myNicname = props.myNicname
    const answerWord = props.answerWord
    const answerApi = props.answerApi
    const presenter = props.presenter
    const showAnswer = props.showAnswer
    // const whoGetScore = props.whoGetScore
    // const toNext = props.toNext

    
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
        if(!showAnswer){
            const timer = setInterval(() => {
                setTimerCount( timerCount => timerCount - 1)
            }, 1000)
            if (timerCount === 0) {
                props.whoGetScore('')
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
                {showAnswer || presenter === myNicname  ? (
                    <div className="box">
                    <div className="box">answer</div>
                        <video autoPlay loop>
                            <source src="http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20200824/735073/MOV000259232_700X466.mp4"></source>
                        </video>
                    </div>
                ) : (
                <div className="box">
                    <div className="box">answer</div>
                    <img className="box" src={lock}></img>
                </div>
                    )}
            </div>
        </div>
        )
    }

export default AnswerVideo