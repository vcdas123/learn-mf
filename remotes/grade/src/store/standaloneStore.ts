// Standalone Redux store for development mode
// This is only used when running the remote in standalone mode
import { configureStore } from "@reduxjs/toolkit";

// Mock slices for standalone mode
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

const mockCounterSlice = {
  name: "counter",
  initialState: {
    value: 0,
    history: [0],
  },
  reducers: {},
};

// Create a minimal store for standalone mode
export const standaloneStore = configureStore({
  reducer: {
    app: (state = mockAppSlice.initialState) => state,
    counter: (state = mockCounterSlice.initialState) => state,
  },
});

export type StandaloneRootState = ReturnType<typeof standaloneStore.getState>;

