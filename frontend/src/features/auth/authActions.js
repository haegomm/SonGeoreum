import axios from 'axios';
import { LOGIN, SIGNUP } from './authTypes';

function login(data) {
  const request = axios.post('/api/users/login', data).then((response) => response.data);
  return {
    type: LOGIN,
    payload: request,
  };
}

function signup(data) {
  const request = axios.post('/api/users/register', data).then((response) => response.data);
  return {
    type: SIGNUP,
    payload: request,
  };
}

const actions = { 
  login, 
  signup 
}

export default actions;