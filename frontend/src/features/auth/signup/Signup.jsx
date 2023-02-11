import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";

import authAction from '../../../common/api/authAction';
import profileImages from '../../../assets/profile/profileImages';
import "./Signup.scss";
import authValidation from '../authValidation';

function Signup(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Email, setEmail] = useState('');
  const [Nickname, setNickname] = useState('');
  const [Password, setPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('')
  const [emailError, setEmailError] = useState('')
  const [emailFormError, setEmailFormError] = useState('')
  const [nicknameError, setNicknameError] = useState('')
  const [nicknameFormError, setNicknameFormError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

  const onEmailHandler = (e) => {
    const currentEmail = e.currentTarget.value
    setEmail(currentEmail);
    authValidation(currentEmail, 'email') ? setEmailFormError('') : setEmailFormError('올바르지 않은 이메일 형식입니다')
    dispatch(authAction.checkEmail(currentEmail)).then((response) => {
      if (response.payload === 'success' || currentEmail === '') {
        setEmailError('')
      } else{
        setEmailError('이미 가입한 이메일입니다');
      }
    });
  };

  const onNicknameHandler = (e) => {
    const currentNickname = e.currentTarget.value
    setNickname(currentNickname)
    authValidation(currentNickname, 'nickname') ? setNicknameFormError('') : setNicknameFormError('2자 이상 8자 이하의 닉네임을 입력해주세요');
    dispatch(authAction.checkNickname(currentNickname)).then((response) => {
      if (response.payload === 'success' || currentNickname === '') {
        setNicknameError('');
      } else{
        setNicknameError('중복 닉네임이 존재합니다')
      }
    });
  };

  const onPasswordHandler = (e) => {
    setPassword(e.currentTarget.value);
    console.log('비밀번호 유효성', authValidation(e.currentTarget.value, 'password'))
    authValidation(e.currentTarget.value, 'password') ? setPasswordError('') : setPasswordError('8자 이상 20자 이하의 비밀번호를 입력해주세요')
  };
  const onConfirmPasswordHandler = (e) => {
    setConfirmPassword(e.currentTarget.value);
    Password === e.currentTarget.value ? setConfirmPasswordError('') : setConfirmPasswordError('비밀번호가 일치하지 않습니다')
  };

  const onImageHandler = (e) => {
    setProfileImageUrl(e.currentTarget.src)
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
  
    let body = {
      userType: 'NORMAL',
      email: Email,
      password: Password,
      nickname: Nickname,
      picture: profileImageUrl
    };

    dispatch(authAction.signup(body)).then((response) => {
      if (response.payload === 'success') {
        alert('환영합니다~~~');
        navigate('/login');
      } else{
        alert('가입에 실패하였습니다. 다시 시도해주세요');
      }
    });
  };

  return (
    <div>
      <h1>회원가입</h1>
      <br />
      <div>
        <form
          onSubmit={onSubmitHandler}>
          <label>이메일</label>
          <input type="email" onBlur={onEmailHandler} />
          <span>{emailError}</span>
          <span>{emailFormError}</span>
          <br />
          <span>닉네임</span>
          <input type="text" onBlur={onNicknameHandler} />
          <span>{nicknameError}</span>
          <span>{nicknameFormError}</span>
          <br />
          <span>비밀번호</span>
          <input type="password" value={Password} onChange={onPasswordHandler} />
          <span>{passwordError}</span>
          <br />
          <span>비밀번호 확인</span>
          <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />
          <span>{confirmPasswordError}</span>
          <br />
          <p>프로필 사진</p>
          <div>
            {profileImages.map((profileImage) => (
              <img
                className={profileImage===profileImageUrl ? 'selected' : 'unselected'}
                key={profileImage}
                src={profileImage}
                alt={profileImage}
                onClick={onImageHandler}
              />
            ))}
          </div>
          <button type="submit">가입</button>
        </form>
      </div>
    </div>
  )
}

export default Signup;