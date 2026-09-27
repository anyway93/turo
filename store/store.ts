import { configureStore } from "@reduxjs/toolkit";
import { toursReducer } from "./tours-slice";

export const store = configureStore({
  reducer: {
    tours: toursReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
