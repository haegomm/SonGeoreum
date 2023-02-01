import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../authActions';
import { useNavigate } from "react-router-dom";


function Signup(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Email, setEmail] = useState('');
  const [Nickname, setNickname] = useState('');
  const [Password, setPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');

  const onEmailHandler = (e) => {
    setEmail(e.currentTarget.value);
  };
  const onNicknameHandler = (e) => {
    setNickname(e.currentTarget.value);
  };
  const onPasswordHandler = (e) => {
    setPassword(e.currentTarget.value);
  };
  const onConfirmPasswordHandler = (e) => {
    setConfirmPassword(e.currentTarget.value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if ( Password !== ConfirmPassword) {
      return alert('비밀번호가 일치하지 않습니다');
    }
  
    let body = {
      userType: 'NORMAL',
      email: Email,
      password: Password,
      nickname: Nickname,
      picture: '' // 수정예정: 프로필 URL 추가해줘야 됨 
    };

    dispatch(actions.signup(body)).then((response) => {
      console.log(response)
      if (response.payload.Success) {
        console.log('가입성공!');
        navigate('/login');
      } else{
        alert('가입Error');
      }
    });
  };

  return (
    <div>
      <h1>여기가 회원가입</h1>
      <br />
      <div>
        <form
          onSubmit={onSubmitHandler}>
          <label>이메일</label>
          <input type="email" value={Email} onChange={onEmailHandler}/>
          <br />
          <span>닉네임</span>
          <input type="text" value={Nickname} onChange={onNicknameHandler} />
          <br />
          <span>비밀번호</span>
          <input type="password" value={Password} onChange={onPasswordHandler} />
          <br />
          <span>비밀번호 확인</span>
          <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />
          <br />
          <button type="submit">가입</button>
        </form>
      </div>
    </div>
  )
}

export default Signup;
