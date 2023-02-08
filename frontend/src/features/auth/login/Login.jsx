import React, { useState } from 'react';

import { useDispatch } from 'react-redux';
import authAction from '../../../common/api/authAction';
import { BrowserRouter as Router, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { saveUserInfo } from '../../../common/api/authInfo';
import socailLoginButtons from '../../../assets/socialLogin/socialLoginButtons';

function Login(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const KAKAO_API = process.env.REACT_APP_KAKAO_API
  const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID
  const KAKAO_REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI
  const KAKAO_REQUEST = `${KAKAO_API}/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`
  
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);

  const onEmailHandler = (e) => {
    setEmail(e.currentTarget.value);
  };
  const onPasswordHandler = (e) => {
    setPassword(e.currentTarget.value);
  };
  const onSubmitHandler = (e) => {
    e.preventDefault();

    let body = {
      email: Email,
      password: Password,
    };

    dispatch(authAction.login(body)).then((response) => {
      if (response.payload.message) {
        setIsLogin(true)
        saveUserInfo(response.payload)
        alert('로그인 성공!')
        navigate('/');
      } else{
        alert('로그인에 실패했습니다. 다시 시도해주세요');
      }
    });
  };

  return (
    <div>
      <h1>로그인</h1>
      <form
        onSubmit={onSubmitHandler}>
        <label>이메일</label>
        <input type="email" onChange={onEmailHandler} />
        <label>비밀번호</label>
        <input type="password" onChange={onPasswordHandler} />
        <br />
        <button type="submit">로그인하기</button>
      </form>
      아이디가 없으신가요?
      <br />
      <Link to="/signup">가입하기</Link>
      <br />
      <a href={KAKAO_REQUEST}>
        <img
        src={socailLoginButtons}
        alt='' />
      </a>
    </div>
  )
}

export default Login;