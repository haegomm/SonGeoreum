import axios from './https'
import { MODIFYPROFILE, ENQUIREPROFILE, ISSUEACCESSTOKEN } from './userType';


function modifyprofile(data) {
  const request = axios.put('/api/user/profile', data).then((response) => response.data)
  .catch((err) => err)
  return {
    type: MODIFYPROFILE,
    payload: request,
  }
}

function enquireProfile(data) {
  const request = axios.get(`/api/user/profile/${data}`).then((response) => response.data)
  .catch((err) => err)
  return {
    type: ENQUIREPROFILE,
    payload: request,
  }
}

// function issueAccessToken(data) {
//   const request = axios.get(`/api/user/refresh/${data}`).then((response) => response.data)
//   .catch((err) => err)
//   return {
//     type: ISSUEACCESSTOKEN,
//     payload: request,
//   }
// }

const userAction = { 
  modifyprofile,
  enquireProfile,
}

export default userAction;