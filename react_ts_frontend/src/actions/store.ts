import { configureStore } from '@reduxjs/toolkit';
import { reducers } from "../reducers/index.ts";

export const store = configureStore({
  reducer: reducers,
});