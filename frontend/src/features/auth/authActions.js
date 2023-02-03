import { axios } from '../../common/api/https'
import { LOGIN, SIGNUP, EMAILCHECK } from './authTypes';

function login(data) {
  const request = axios.post('/api/user/login', data).then((response) => response.data);
  return {
    type: LOGIN,
    payload: request,
  };
}

function signup(data) {
  const request = axios.post('/api/user/signup', data).then((response) => response.data);
  return {
    type: SIGNUP,
    payload: request,
  };
}

function emailCheck(data) {
  const request = axios.get(`/api/user/signup/email/${data}`).then((response) => response.data);
  return {
    type: EMAILCHECK,
    payload: request,
  }
}


const actions = { 
  login, 
  signup,
  emailCheck,
}

export default actions;