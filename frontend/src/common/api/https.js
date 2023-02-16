import baseAxios from "axios";
import { deleteUserInfo, getUserInfo } from "./authInfo";

const axios = baseAxios.create({
  baseURL: process.env.REACT_APP_API,
  headers: {
    "Content-Type": "application/json",
  },
});

axios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getUserInfo().accessToken}`;
  return config;
});

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response && error.response.status) {
      switch (error.response.status) {
        case 401:
          alert("로그인이 필요합니다.");
          window.location.replace("/login");
          deleteUserInfo();
          return new Promise(() => {});
        default:
          return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
