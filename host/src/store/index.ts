import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slices/appSlice";
import counterReducer from "./slices/counterSlice";

// Create store with reducers
export const store = configureStore({
  reducer: {
    app: appReducer,
    counter: counterReducer,
    // Add more reducers here as needed
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
