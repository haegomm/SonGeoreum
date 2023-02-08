import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import authAction from "../api/authAction";
import { deleteUserInfo, getUserInfo } from "../api/authInfo";
import setIsLogin from './Navbar'
import ModifyProfile from './ModifyProfile';
import './NavbarSide.scss'

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

export default function NavbarSide({onLoginHandler}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const userId = getUserInfo().userId
  const nickname = getUserInfo().nickname
  const picture = getUserInfo().picture

  // const []
  
  // const onToggleHandler = () => {
  //   setIsOpen(isOpen => !isOpen);
  // }
  const onLogoutHandler = (e) => {
    e.preventDefault();

    dispatch(authAction.logout(userId)).then((response) => {
      console.log('로갓눌럿다')
      deleteUserInfo()
      navigate('/');
      // useEffect(() => {},[Location])
      // if (response.payload === 'success') {
      //   alert('로그아웃이 완료되었습니다');
      //   navigate('/');
      //   deleteUserInfo()
      // } else{
      //   alert('로그아웃에 실패하였습니다. 다시 시도해주세요');
      // }
    })
  }

  const onMyVocaaHandler = (e) => {
    console.log('단어장으로 이동해용~')
    // navigate('/'); 나의단어장 생기면 그쪽으로 이동
  }

  const onModifingHandler = (e) => {
    console.log('플필수정')
    // 프로필수정 추가
  }
  
  const [state, setState] = useState({right: false});

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      >
      <List>
        <ListItem key='profileBlock' disablePadding>
        <img src={picture} alt="profileImage" />
      </ListItem>
      <ListItem key='ProfileInfo' disablePadding>
        <span>{nickname}</span>
        <span>님</span>
        </ListItem>
      </List>
      <Divider />
      <List
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
      >
        <ListItem key='logoutButton' disablePadding>
          <ListItemButton>
            <ListItemText
              primary='로그아웃'
              onClick={() => {
                onLoginHandler(getUserInfo().userId)
                onLogoutHandler()
              } }/>
          </ListItemButton>
        </ListItem>
        <ListItem key='myVocaButton' disablePadding>
          <ListItemButton>
            <ListItemText
              primary='나의 단어장'
              onClick={onMyVocaaHandler} />
          </ListItemButton>
        </ListItem>
        <ListItem key='modifyProfileButton' disablePadding>
          <ListItemButton>
            <ListItemText
              primary='프로필 수정'
              onClick={onModifingHandler} />
          </ListItemButton>
        </ListItem>
      </List>
      <List>
        <ListItem key='modifyProfileButton' disablePadding>
          <ListItemButton>
            <ModifyProfile />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
        <React.Fragment key='right'>
          <Button onClick={toggleDrawer('right', true)}>
            <img className="drawerButton" src={picture} alt="profileImage" />
            </Button>
          <Drawer
            anchor='right'
            open={state['right']}
            onClose={toggleDrawer('right', false)}
          >
            {list('right')}
          </Drawer>
        </React.Fragment>
    </div>
  );
}