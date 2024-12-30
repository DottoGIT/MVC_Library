import { combineReducers } from "redux";
import { bookReducer } from "./bookReducer.ts";
import { userReducer } from "./userReducer.ts";

export const reducers = combineReducers({
    bookReducer,
    userReducer
});