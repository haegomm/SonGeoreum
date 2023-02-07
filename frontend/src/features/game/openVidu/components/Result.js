import { useLocation } from "react-router-dom"

const Result = () => {

  const location = useLocation()
  const playerList = location.state.playerList
  const scoreList = location.state.scoreList
  
  return (
    <div>

    </div>
  )
}

export default Result