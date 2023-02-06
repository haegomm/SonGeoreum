import {axios} from './https'
import { UPDATEEXPERIENCE, WAITINGROOMOUT } from './gameType';

function updateExperience(data) {
  const request = axios.put('/api/user/game', data).then((response) => response.data)
  .catch((err) => err)
  return {
    type: UPDATEEXPERIENCE,
    payload: request,
  };
}
  
function waitingroomOut(data) {
  const request = axios.post('/api/game/session/user', data).then((response) => response.data)
  .catch((err) => err)
  return {
    type: WAITINGROOMOUT,
    payload: request,
  }
}

  const gameAction = { 
    updateExperience,
    waitingroomOut
  }
  
export default gameAction;