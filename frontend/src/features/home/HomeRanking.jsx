import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import ranking from '../../common/api/rankingInfo'

function HomeRanking() {
  const dispatch = useDispatch

  const [rankingList, setRankingList] = useState([])

  function ranking() {dispatch(ranking()).then((response) => {
    console.log('랭킹정보', response)
  })}

  useEffect(() => 
    {const refreshRanking = setInterval(() => 
    ranking(), 10000)}, [])

  return (
    <div>HomeRanking</div>
  )
}

export default HomeRanking