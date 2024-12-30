import api from "./api.ts";
import { User } from "../interfaces/user.ts";

export enum USER_ACTION_TYPES {
  LOGIN = "LOGIN",
  SIGNUP = "SIGNUP",
  LOGOUT = "LOGOUT",
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

export type UserAction = LoginAction | SignupAction | LogoutAction;

export const login = (userData: { username: string; password: string }) => async (dispatch: any) => {
  try {
    const response = await api.userAPI.login(userData);
    console.log(response);
    const { token, user } = response.data;
    localStorage.setItem("authToken", token);
    dispatch({
      type: USER_ACTION_TYPES.LOGIN,
      payload: { token, user },
    });
  } catch (error) {
    console.error("Login failed", error);
  }
};

export const signup = (userData: { username: string; password: string, email: string, firstName: string, lastName: string, confirmPassword: string }) => async (dispatch: any) => {
    try {
      const response = await api.userAPI.signup(userData);
      console.log(response);
      const { token, user } = response.data;
      localStorage.setItem("authToken", token);
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
    dispatch({
      type: USER_ACTION_TYPES.LOGOUT,
    });
  };