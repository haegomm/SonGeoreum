import React, { useState } from 'react';

import { useDispatch } from 'react-redux';
import authAction from '../../../common/api/authAction';
import { BrowserRouter as Router, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { saveUserInfo } from '../../../common/api/authInfo';

function Login(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      if (response.payload.loginSuccess) {
        saveUserInfo(response.payload.user)
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
        <input type="email" value={Email} onChange={onEmailHandler} />
        <label>비밀번호</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <br />
        <button type="submit">로그인하기</button>
      </form>
      아이디가 없으신가요?
      <br />
      <Link to="/signup">가입하기</Link>
    </div>
  )
}

export default Login;