import React from 'react'

export const saveUserInfo = (user) => {
  window.localStorage.setItem('userId', user.id)
  window.localStorage.setItem('userType', user.userType);
  window.localStorage.setItem('email', user.email)
  window.localStorage.setItem('nickname', user.nickname)
  window.localStorage.setItem('picture', user.picture);
  window.localStorage.setItem('level', user.level)
  window.localStorage.setItem('experience', user.experience)
  window.localStorage.setItem('accessToken', user.accessToken)
};
export const getUserInfo = () => {
  return {
    userId:window.localStorage.getItem('userId'),
    userType:window.localStorage.getItem('userType'),
    email:window.localStorage.getItem('email'),
    nickname:window.localStorage.getItem('nickname'),
    picture:window.localStorage.getItem('picture'),
    level:window.localStorage.getItem('level'),
    experience:window.localStorage.getItem('experience'),
    accessToken:window.localStorage.getItem('accessToken'),
  }
};
export const deleteUserInfo = () => {
  window.localStorage.removeItem('userId')
  window.localStorage.removeItem('userType');
  window.localStorage.removeItem('email')
  window.localStorage.removeItem('nickname')
  window.localStorage.removeItem('picture');
  window.localStorage.removeItem('level')
  window.localStorage.removeItem('experience')
  window.localStorage.removeItem('accessToken')
};