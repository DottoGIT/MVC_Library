import { combineReducers } from "redux";
import { bookReducer } from "./bookReducer.ts";

export const reducers = combineReducers({
    bookReducer,
});