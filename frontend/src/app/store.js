import { combineReducers } from 'redux';
import user from '../features/auth/authReducers';

// 리듀서들을 합쳐 rootReducer를 만든다.
const rootReducer = combineReducers({
  user,
});

export default rootReducer;