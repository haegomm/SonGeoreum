import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import authAction from "../api/authAction";
import { deleteUserInfo, getUserInfo } from "../api/authInfo";
import './Sidebar.scss'
import onLoginHandler from './Navbar'
import setIsOpen from './Navbar'

function Sidebar(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const userId = getUserInfo().userId
  const nickname = getUserInfo().nickname
  const picture = getUserInfo().picture

  // const []
  let state = useSelector((state)=>{ return state })
  console.log(state)
  
  const onToggleHandler = () => {
    setIsOpen(isOpen => !isOpen);
  }
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
    <div onClick={onToggleHandler}>X</div>
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