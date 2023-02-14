import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";

import authAction from '../../../common/api/authAction';
import profileImages from '../../../assets/profile/profileImages';
import "./Signup.scss";
import authValidation from '../authValidation';
import LargeButton from '../../../common/button/LargeButton';

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
      if (response.payload.message === 'success' || currentEmail === '') {
        setEmailError('')
      }else{
        setEmailError('이미 가입한 이메일입니다')
      }
    });
  };

  const onNicknameHandler = (e) => {
    const currentNickname = e.currentTarget.value
    setNickname(currentNickname)
    authValidation(currentNickname, 'nickname') ? setNicknameFormError('') : setNicknameFormError('2자 이상 8자 이하의 닉네임을 입력해주세요');
    dispatch(authAction.checkNickname(currentNickname)).then((response) => {
      if (response.payload.message === 'success' || currentNickname === '') {
        setNicknameError('')
      }else{
        setNicknameError('중복 닉네임이 존재합니다')
      }
    });
  };

  const onPasswordHandler = (e) => {
    setPassword(e.currentTarget.value);
    authValidation(e.currentTarget.value, 'password') ? setPasswordError('') : setPasswordError('8자 이상 20자 이하의 비밀번호를 입력해주세요')
  };

  const onConfirmPasswordHandler = (e) => {
    setConfirmPassword(e.currentTarget.value);
    Password === e.currentTarget.value ? setConfirmPasswordError('') : setConfirmPasswordError('비밀번호가 일치하지 않습니다')
  }

  const onImageHandler = (e) => {
    console.log(e.currentTarget.src)
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
      console.log(response)
      if (response.payload.message === 'success') {
        alert('환영합니다~~~');
        navigate('/login');
      } else{
        alert('가입에 실패하였습니다. 다시 시도해주세요');
      }
    });
  };

  return (
    <div>
      <h1 className='signUpTitle'>회원가입</h1>
      <br />
      <div>
        <form
          onSubmit={onSubmitHandler} className='formItemSignup'>
          <div className='emailDiv'>
          <input type="email" placeholder="이메일" className='signUpInputEmail' onBlur={onEmailHandler} />
          </div>
          <span className='emailError'>{emailError}{emailFormError}</span>
          
          <div className='nicknameDiv'>
          <input type="text" placeholder="닉네임" className='signUpInputNickname' onBlur={onNicknameHandler} />
          </div>
          <span className='nicknameError'>{nicknameError}{nicknameFormError}</span>
          
          <div className='passwordDiv'>
          <input type="password" placeholder="비밀번호" className='signUpInputPassword' value={Password} onChange={onPasswordHandler} />
          </div>
            <span className='passwordError'>{passwordError}</span>
          
          
          <div className='passwordCheckDiv'>
          <input type="password" placeholder="비밀번호 확인" className='signUpInputPasswordCheck' value={ConfirmPassword} onChange={onConfirmPasswordHandler} />
          </div>
            <span className='passwordCheckError'>{confirmPasswordError}</span>
          <div className='profileList1'>
            {profileImageList1().map((profileImage, idx) => (
              <img
                className={profileImage.src===profileImageUrl.src ? 'unselected' : 'selectedImg'}
                key={profileImage}
                src={profileImage}
                alt={profileImage}
                onClick={onImageHandler}
              />
            ))}
          </div>
          <div className='profileList2'>
            {profileImageList2().map((profileImage) => (
              <img
                className={profileImage===profileImageUrl ? 'selected' : 'unselected'}
                key={profileImage}
                src={profileImage}
                alt={profileImage}
                onClick={onImageHandler}

              />
            ))}
          </div>
          <button type="submit" className='signupButton' disabled={Email && Nickname && Password && ConfirmPassword && profileImageUrl && !emailError && !emailFormError && !nicknameError && !nicknameFormError && !passwordError && !confirmPasswordError ? false : true}>
              가입하기
          </button>
        </form>
      </div>
    </div>
  )
}
function profileImageList1() {
  let list1 = [];
  for (let i = 0; i < 6; i++) {
    list1.push(profileImages[i]);
  }
  return list1;
}
function profileImageList2() {
  let list2 = [];
  for (let i = 6; i < profileImages.length; i++) {
    list2.push(profileImages.at(i));
  }
  return list2;
}


export default Signup;