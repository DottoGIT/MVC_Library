import { User } from "../interfaces/user.ts";
import * as actions from "../actions/userActions.ts";

export interface UserState {
  currentUser: User | null;
  token: string | null;
}

export const initialState: UserState = {
  currentUser: null,
  token: localStorage.getItem("authToken"),
};

export const userReducer = (
  state = initialState,
  action: actions.UserAction
): UserState => {
  switch (action.type) {
    case actions.USER_ACTION_TYPES.LOGIN:
    case actions.USER_ACTION_TYPES.SIGNUP:
      return {
        ...state,
        currentUser: action.payload.user,
        token: action.payload.token,
      };

    case actions.USER_ACTION_TYPES.LOGOUT:
      return {
        ...state,
        currentUser: null,
        token: null,
      };

    default:
      return state;
  }
};
