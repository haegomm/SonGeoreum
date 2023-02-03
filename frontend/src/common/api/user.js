import axios from './https'

function email(data) {
  const request = axios.post('/api/user/login', data).then((response) => response.data);
  return {
    type: LOGIN,
    payload: request,
  };
}