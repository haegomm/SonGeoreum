import React, { useState } from 'react';

import { useDispatch } from 'react-redux';
import actions from '../authActions';
import { useNavigate } from "react-router-dom";

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

    dispatch(actions.login(body)).then((response) => {
      console.log(response)
      if (response.payload.loginSuccess) {
        console.log('로그인성공!');
        navigate('/');
      } else{
        console.log(response.payload.message)
        alert('Error');
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
    </div>
  )
}

export default Login;