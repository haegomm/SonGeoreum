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
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

  const onEmailHandler = (e) => {
    setEmail(e.currentTarget.value);
    console.log('중복체크', authValidation(e.currentTarget.value, 'email') === false)
    console.log('공백체크', Email !== '')
    authValidation(e.currentTarget.value, 'email') === false && Email !== ''? setEmailFormError('') : setEmailFormError('올바르지 않은 이메일 형식입니다')
    dispatch(authAction.checkEmail(e.currentTarget.value)).then((response) => {
      if (response.payload === 'success' && Email !== '') {
        setEmailError('')
      } else{
        setEmailError('이미 가입한 이메일입니다');
      }
    });
  };

  const onNicknameHandler = (e) => {
    setNickname(e.currentTarget.value)
    authValidation(e.currentTarget.value, 'nickname') && Nickname !== '' ? setNicknameError('') : setNicknameError('2자 이상 6자 이하의 문자열을 입력해주세요');
    dispatch(authAction.checkNickname(e.currentTarget.value)).then((response) => {
      if (response.payload !== 'success') {
        setNicknameError('중복 닉네임이 존재합니다')
      } else{
        setNicknameError('');
      }
    });
  };
  const onPasswordHandler = (e) => {
    setPassword(e.currentTarget.value);
    authValidation(e.currentTarget.value, 'password') ? setPasswordError('') : setPasswordError('8자 이상 20자 이하의 문자열을 입력해주세요')
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