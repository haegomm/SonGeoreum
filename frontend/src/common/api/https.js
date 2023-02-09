import React from 'react'
import baseAxios from 'axios';
import { getUserInfo } from './authInfo';

const axios = baseAxios.create({
  baseURL: process.env.REACT_APP_API,     // 환경변수 세팅
  headers: {
    'Content-Type': 'application/json',
  },
});

// request 보내기 전에 인터셉트 해서 이 작업을 선행한다: 헤더에 토큰 넣기
axios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getUserInfo().accessToken}`;
  return config;
});

export default axios;