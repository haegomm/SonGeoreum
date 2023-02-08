import { useLocation } from "react-router-dom"

const Result = () => {

  const location = useLocation()
  const result = location.state.result
  console.logt(result)

  const ranking = result.sort((a,b) => b.score - a.score)
  console.log(ranking)
  
  return (
    <div>
      <h1>✨게임 결과✨</h1>
        {ranking.map((it) => (
          <div>
            <div>등수: {(ranking.indexof(it))+1}</div>
            <div>닉네임: {it.nickname}</div>
            <div>얻은 경험치: {it.score}</div>
          </div>
        ))}
    </div>
  )
}

export default Result