import { configureStore } from "@reduxjs/toolkit";

const mockAppSlice = {
  name: "app",
  initialState: {
    theme: "light" as const,
    currentModule: null,
    notifications: [],
    user: { name: "Standalone User", role: "developer" },
  },
  reducers: {},
};

export const standaloneStore = configureStore({
  reducer: {
    app: (state = mockAppSlice.initialState) => state,
  },
});

export type StandaloneRootState = ReturnType<typeof standaloneStore.getState>;
