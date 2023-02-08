import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import authAction from '../api/authAction';
import profileImages from '../../assets/profile/profileImages';
import authValidation from '../../features/auth/authValidation';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';

function ModifyProfile() {
  const dispatch = useDispatch();

  const [expanded, setExpanded] = useState(false);
  const [Nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('')
  const [profileImageUrl, setProfileImageUrl] = useState('')

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
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

  return (
    <div>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary id="panel1bh-header">
          <Typography>
            프로필수정
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            여기서 프로필을 수정해요
          </Typography>
          <Typography>
            여기서 프로필을 수정해요
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default ModifyProfile
