import api from "./api.ts";
import { User } from "../interfaces/user.ts";

export enum USER_ACTION_TYPES {
  LOGIN = "LOGIN",
  SIGNUP = "SIGNUP",
  LOGOUT = "LOGOUT",
  FETCH = "FETCH_USERS",
  DELETE = "DELETE_USERS"
}
export interface FetchUsersAction {
  type: USER_ACTION_TYPES.FETCH;
  payload: {
    users: User[];
    pagination: {
      currentPage: number;
      totalPages: number;
    }
  }
}

export interface LoginAction {
  type: USER_ACTION_TYPES.LOGIN;
  payload: {
    user: User;
    token: string;
  };
}

export interface SignupAction {
  type: USER_ACTION_TYPES.SIGNUP;
  payload: {
    user: User;
    token: string;
  };
}

export interface LogoutAction {
  type: USER_ACTION_TYPES.LOGOUT;
}

export interface DeleteUserAction {
  type: USER_ACTION_TYPES.DELETE;
}

export type UserAction = LoginAction | SignupAction | LogoutAction | FetchUsersAction | DeleteUserAction;
type ThunkUserAction = (dispatch: React.Dispatch<UserAction>) => void;

export const login = (userData: { userName: string; password: string }) => async (dispatch: any) => {
  try {
    const response = await api.userAPI.login(userData);
    console.log(response);
    const { token, user } = response.data;
    localStorage.setItem("authToken", token);
    localStorage.setItem("currentUser", JSON.stringify(user));
    dispatch({
      type: USER_ACTION_TYPES.LOGIN,
      payload: { token, user },
    });
  } catch (error) {
    console.error("Login failed", error);
  }
};

export const signup = (userData: { userName: string; password: string, email: string, firstName: string, lastName: string, confirmPassword: string }) => async (dispatch: any) => {
    try {
      const response = await api.userAPI.signup(userData);
      console.log(response);
      const { token, user } = response.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("currentUser", JSON.stringify(user));
      dispatch({
        type: USER_ACTION_TYPES.SIGNUP,
        payload: { token, user },
      });
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

export const logout = () => (dispatch: any) => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("currentUser");
  dispatch({
    type: USER_ACTION_TYPES.LOGOUT,
  });
};

export const fetchUsers = (searchString: string, page: number): ThunkUserAction => {
  return (dispatch) => {
    api.userAPI
      .getUsers(searchString, page)
      .then((response) => {
        console.log(response);
        dispatch({
          type: USER_ACTION_TYPES.FETCH,
          payload: {
            users: response.data.data,
            pagination: response.data.pagination
          }
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
};

export const deleteUser = (id: string) => async (dispatch: any) => {
  try {
    const response = await api.userAPI.deleteUser(id);
    dispatch({
      type: USER_ACTION_TYPES.DELETE,
      payload: id
    });
  } catch (error) {
    alert("Account cannot be deleted, you have made reservations");
  }
};
