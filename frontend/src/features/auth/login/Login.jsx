import React, { useState } from "react";

import { useDispatch } from "react-redux";
import authAction from "../../../common/api/authAction";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { saveUserInfo } from "../../../common/api/authInfo";
import socailLoginButtons from "../../../assets/socialLogin/socialLoginButtons";
import LargeButton from "../../../common/button/LargeButton";


import "../../study/FadeIn.scss";
import "./Login.scss";
import { textAlign } from "@mui/system";

function Login(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const KAKAO_API = process.env.REACT_APP_KAKAO_API
  const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID
  const KAKAO_REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI
  const KAKAO_REQUEST = `${KAKAO_API}/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`
  
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');

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
      if (response.payload.message === 'success') {
        saveUserInfo(response.payload)
        alert('로그인 성공!')
        window.location.replace("/")
        // navigate('/');
      } else{
        alert('로그인에 실패했습니다. 다시 시도해주세요');
      }
    });
  };

  return (
    <div className="fade-in-up">
      <h1 className='loginTitle'>로그인</h1>
      <form onSubmit={onSubmitHandler} >
        <div className='formItem'>
          <input type="email" placeholder='이메일' className='inputEmail' onChange={onEmailHandler} />
          </div>
        <div className='formItem'>
        <input type="password" placeholder='비밀번호' className='inputPassword' onChange={onPasswordHandler} />
        </div>
        <div>
        <button type="submit" className='loginButton'>로그인하기</button>
        </div>
      </form>
      <div className='idMessage'>
      아직 아이디가 없으신가요?
      </div>
      <div className='bottomButton'>
      <Link to="/signup">
        <button className="normalSignUpButton">
          가입하기
        </button>
        </Link>
      <a href={KAKAO_REQUEST}>
        <img src={socailLoginButtons} className='kakaoSignUpButton' alt="" />
      </a>
      </div>
    </div>
  );
}

export default Login;
