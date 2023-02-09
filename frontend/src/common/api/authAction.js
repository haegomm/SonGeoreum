import axios from './https'
import { LOGIN, SIGNUP, LOGOUT,  CHECKEMAIL, MODIFYPROFILE, CHECKNICKNAME, ENQUIREPROFILE, ISSUEACCESSTOKEN, KAKAOLOGIN } from '../../features/auth/authTypes';

function login(data) {
  const request = axios.post('/api/user/login', data).then((response) => response.data)
  .catch((err) => err)
  return {
    type: LOGIN,
    payload: request,
  };
}

function signup(data) {
  const request = axios.post('/api/user/signup', data).then((response) => response.data)
  .catch((err) => err)
  return {
    type: SIGNUP,
    payload: request,
  };
}

function checkEmail(data) {
  const request = axios.get(`/api/user/signup/email/${data}`).then((response) => response.data)
  .catch((err) => err)
  return {
    type: CHECKEMAIL,
    payload: request,
  }
}

function checkNickname(data) {
  const request = axios.get(`/api/user/signup/nickname/${data}`).then((response) => response.data)
  .catch((err) => err)
  return {
    type: CHECKNICKNAME,
    payload: request,
  }
}

function logout() {
  const request = axios.get(`/api/user/logout`).then((response) => response.data)
  .catch((err) => err)
  return {
    type: LOGOUT,
    payload: request,
  }
}

function kakakoLogin() {
  const request = axios.get('/api/oauth2/authorization/kakao').then((response) => response.data)
  .catch((err) => err)
  return {
    type: KAKAOLOGIN,
    payload: request,
  }
}

const authAction = { 
  login, 
  signup,
  checkEmail,
  checkNickname,
  logout,
  kakakoLogin,
}

export default authAction;