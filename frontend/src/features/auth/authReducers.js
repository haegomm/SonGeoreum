import { LOGIN, SIGNUP } from './authTypes';

export default function user(state = {}, action) {
  switch (action.type) {
    case LOGIN:
      return { ...state, loginSuccess: action.payload };
    case SIGNUP:
      return { ...state, resisterSuccess: action.payload };
      
    default:
      return state;
  }
}