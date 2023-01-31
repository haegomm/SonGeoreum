import React, { useEffect, useState } from "react";

const AnswerVideo = () => {
    let [timeOver, setTiemOver] = useState(false)
    const [ count, setCount ] = useState(5)
    
    useEffect(() => {
        const timer = setInterval(() => {
            setCount( count => count - 1)
        }, 1000)
        if (count === 0) {
            setTiemOver(!timeOver)
            clearInterval(timer)
        }
        return () => clearInterval(timer)
        // const timer = setTimeout(() => { setTiemOver(!timeOver) }, 2000);
        // return () => clearTimeout(timer)
        }, [count])

    return (
        <div>
            <div className="box">answer</div>
            <div className="box">
                <h1>{ count }</h1>
            </div>
            <div className="box">AnswerVideo</div>
        </div>
    //     {
    //         timeOver === true
    //         ? (<div>
    //         <p>정답 영상</p>
    //         </div>)
    //         : <img></img>
    //     }
    )
}

export default AnswerVideo