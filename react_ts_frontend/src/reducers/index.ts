import { combineReducers } from "redux";
import { bookReducer } from "./bookReducer.ts";
import { userListReducer, userReducer } from "./userReducer.ts";
import { leaseReducer } from "./leaseReducer.ts";

export const reducers = combineReducers({
    bookReducer,
    userReducer,
    userListReducer,
    leaseReducer
});