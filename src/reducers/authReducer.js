import { SIGN_IN, SIGN_OUT } from "../actions/types";

const INITIAL_STATE = {
  isSignedIn: null,
  userId: null,
};

export default function authReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        isSignedIn: action.payload.token,
        userId: action.payload.userId,
        userData: action.payload,
      };

    case SIGN_OUT:
      sessionStorage.removeItem("jwt");
      return { ...state, isSignedIn: false, userId: null };

    default:
      return state;
  }
}
