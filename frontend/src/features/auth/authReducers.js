import { KAKAOLOGIN, LOGIN, SIGNUP } from './authTypes';

export default function user(state = {}, action) {
  switch (action.type) {
    case LOGIN:
      return { ...state, loginSuccess: action.payload };
    case SIGNUP:
      return { ...state, signupSuccess: action.payload };
    case KAKAOLOGIN:
      return { ...state, kakakoSuccess: action.payload };
      
    default:
      return state;
  }
}