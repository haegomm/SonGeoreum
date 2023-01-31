import React, { useEffect, useState } from "react";

const AnswerVideo = () => {
    let [ timeOver, setTiemOver ] = useState(false)
    
    useEffect(()=>{
        setTimeout(()=>{ setTiemOver(!timeOver) }, 2000);
        })

    return (
        <div>AnswerVideo</div>
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