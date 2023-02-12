import axios from './https'
import {RANKING} from './rankingType';

function ranking(data) {
  const request = axios.get('/api/user/ranking').then((response) => response.data)
  .catch((err) => err)
  return {
    type: RANKING,
    payload: request,
  };
}

export default ranking;
