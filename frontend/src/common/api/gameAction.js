import {axios} from './https'
import { UPDATEEXPERIENCE } from './gameType';

function updateExperience(data) {
  const request = axios.put('/api/user/game', data).then((response) => response.data)
  .catch((err) => err)
  return {
    type: UPDATEEXPERIENCE,
    payload: request,
  };
}

const authActions = { 
  updateExperience,
}

export default gameAction;