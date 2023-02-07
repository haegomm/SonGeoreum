import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import profileImages from "../../assets/profile/profileImages";
import authAction from "../api/authAction";
import { deleteUserInfo, getUserInfo } from "../api/authInfo";
import './Sidebar.scss'

function Sidebar(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const userId = getUserInfo().userId
  const nickname = getUserInfo().nickname
  const picture = getUserInfo().picture

  // const []

  const onLogoutHandler = (e) => {
    e.preventDefault();


    dispatch(authAction.logout(userId)).then((response) => {
      console.log('로갓눌럿다')
      deleteUserInfo()
      navigate('/');
      // useEffect(() => {},[Location])
      // if (response.payload === 'success') {
      //   alert('로그아웃이 완료되었습니다');
      //   navigate('/');
      //   deleteUserInfo()
      // } else{
      //   alert('로그아웃에 실패하였습니다. 다시 시도해주세요');
      // }
    })
  }

  return(
  <div class="container">
      <div>
        <img src={picture} alt="profileImage" />
      </div>
      <div>
        <span>{nickname}</span>
        <span>님</span>
      </div>
      <ul>
        <li><p>나의 단어장</p></li>
        <li><p>프로필 수정</p></li>
        <li><span onClick={onLogoutHandler} >로그아웃</span></li>
      </ul>

  </div>
)
}

export default Sidebar;