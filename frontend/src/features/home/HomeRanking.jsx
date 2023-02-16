import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
// import ranking from '../../common/api/rankingInfo'
import axios from '../../common/api/https'
import './HomeRanking.scss'

function HomeRanking() {
  const dispatch = useDispatch

  const [rankingList, setRankingList] = useState([])

  // function rankingInfo() {dispatch(ranking()).then((response) => {
  //   console.log('랭킹정보', response)
  // })}

  // const onRankingHandler = (e) => {
    // rankingInfo()
    // dispatch(ranking()).then((response) => {
    //   console.log(response)
    // })

  // }
  // useEffect(() => {
  //   const refreshRanking = rankingInfo();
  // }, [])
  async function rankingInfo() {
    const data = await axios.get(
      '/api/user/ranking'
      );
      // if (data.data.message === 'success') {
      //   saveUserInfo(data.data)
      //   alert('로그인 성공!')
      //   window.location.replace("/")
      //   // navigate('/');
      // } else{
      //   alert('로그인에 실패했습니다. 다시 시도해주세요');
      // }
      setRankingList(data.data)
    console.log('랭킹!', data)
  }

  useEffect(() => {
    const updateRanking = setInterval(() => 
    rankingInfo(), 10000)}
  ,[])

  return (
    <div>
    <div>HomeRanking</div>
    <div className='rankingMember'>
      {rankingList.map((member, idx) => (
        <div className='wrapElement'>
          <div className={`rankingElement${idx+1}`}>
            <div className='rankingIndex'>{idx+1}</div>
            <div className='rankingLevel'>{member.level}</div>
            <div className='rankingNickname'>{member.nickname}</div>
            <div className='rankingExperience'>{member.experience}</div>
          </div>
        </div>
      ))}
    </div>
    </div>
  )
}

export default HomeRanking