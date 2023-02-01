import React, { useEffect, useState } from "react";
import lock from "../../assets/images/lock.jpg"

const AnswerVideo = () => {
    let [showVideo, setShowVideo] = useState(false)
    const [ count, setCount ] = useState(5)
    
    // Timer
    useEffect(() => {
        const timer = setInterval(() => {
            setCount( count => count - 1)
        }, 1000)
        if (count === 0) {
            setShowVideo(!showVideo)
            clearInterval(timer)
        }
        return () => clearInterval(timer)
        }, [count])

    return (
        <div>
            <div className="box">answer</div>
            <div className="box">
                <h1>{ count }</h1>
            </div>
            {/* 정답 video(api) */}
            <div className="box">
                {/* showVideo || presenter === myId */}
                {showVideo ? (
                    // 나중에 loop속성 넣어서 동영상 반복 재생시키기
                    <video autoPlay> 
                        <source src="http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20200824/735073/MOV000259232_700X466.mp4"></source>
                    </video>) : (<img className="box" src={ lock }></img>)}
            </div>
        </div>
    )
}

export default AnswerVideo