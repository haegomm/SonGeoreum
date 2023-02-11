import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import userAction from '../api/userAction';

import authAction from '../api/authAction';
import profileImages from '../../assets/profile/profileImages';
import authValidation from '../../features/auth/authValidation';
import './ModifyProfile.scss'

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { getUserInfo } from '../api/authInfo';

function ModifyProfile() {
  const dispatch = useDispatch();

  const [expanded, setExpanded] = useState(false);
  const [Nickname, setNickname] = useState(getUserInfo().nickname);
  const [nicknameError, setNicknameError] = useState('')
  const [nicknameFormError, setNicknameFormError] = useState('')
  const [profileImageUrl, setProfileImageUrl] = useState(getUserInfo().picture)

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const onNicknameHandler = (e) => {
    const oldNickname = getUserInfo().nickname
    const currentNickname = e.currentTarget.value
    setNickname(currentNickname)
    console.log(authValidation(currentNickname, 'nickname'))
    authValidation(currentNickname, 'nickname') ? setNicknameFormError('') : setNicknameFormError('2자 이상 8자 이하의 닉네임을 입력해주세요');
    dispatch(authAction.checkNickname(currentNickname)).then((response) => {
      if (response.payload === 'success' || currentNickname === '' || currentNickname === oldNickname) {
        setNicknameError('');
      } else{
        setNicknameError('중복 닉네임이 존재합니다')
      }
    });
  };

  const onImageHandler = (e) => {
    setProfileImageUrl(e.currentTarget.src)
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
  
    let body = {
      nickname: Nickname,
      picture: profileImageUrl
    };

    dispatch(userAction.modifyprofile(body)).then((response) => {
      if (response.payload === 'success') {
        alert('프로필 수정 성공~');
        window.localStorage.setItem('nickname', Nickname)
        window.localStorage.setItem('picture', profileImageUrl)
      } else{
        alert('수정 실패ㅠ~');
      }
    });
  };


  return (
    <div>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary id="panel1bh-header">
          <Typography>
            프로필수정
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
        <div>
        <form
          onSubmit={onSubmitHandler}>
          <label>닉네임</label>
          <input type="text" onBlur={onNicknameHandler} />
          <span>{nicknameError}</span>
          <span>{nicknameFormError}</span>
          <br />
          <br />
          <label>프로필사진</label>
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
          <button type="submit">수정</button>
        </form>
        </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default ModifyProfile
