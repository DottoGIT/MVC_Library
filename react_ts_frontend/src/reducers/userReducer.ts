import { User } from "../interfaces/user.ts";
import * as actions from "../actions/userActions.ts";

export interface UserState {
  currentUser: User | null;
  token: string | null;
}

export interface UserListState {
  list: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
  };
}
export const initialListState: UserListState = {
  list: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
  },
};

export const initialState: UserState = {
  currentUser: JSON.parse(localStorage.getItem("currentUser")!),
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
    case actions.USER_ACTION_TYPES.DELETE:
      return {
        ...state,
        currentUser: null,
        token: null,
      };

    default:
      return state;
  }
};

export const userListReducer = (state = initialListState, action: actions.UserAction): UserListState =>
{
      switch (action.type) {
        case actions.USER_ACTION_TYPES.FETCH:
          return {
            ...state,
            list: [...action.payload.users],
            pagination: action.payload.pagination,
          };
        default:
          return state;
      }
}
