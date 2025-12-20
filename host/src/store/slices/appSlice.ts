import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  theme: "light" | "dark";
  currentModule: string | null;
  notifications: Array<{
    id: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
    timestamp: number;
  }>;
  user: {
    name: string;
    role: string;
  } | null;
}

const initialState: AppState = {
  theme: "light",
  currentModule: null,
  notifications: [],
  user: {
    name: "Demo User",
    role: "admin",
  },
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
    setCurrentModule: (state, action: PayloadAction<string | null>) => {
      state.currentModule = action.payload;
    },
    addNotification: (
      state,
      action: PayloadAction<{
        message: string;
        type: "success" | "error" | "warning" | "info";
      }>
    ) => {
      state.notifications.push({
        id: Date.now().toString(),
        message: action.payload.message,
        type: action.payload.type,
        timestamp: Date.now(),
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    setUser: (
      state,
      action: PayloadAction<{ name: string; role: string } | null>
    ) => {
      state.user = action.payload;
    },
  },
});

export const {
  setTheme,
  setCurrentModule,
  addNotification,
  removeNotification,
  setUser,
} = appSlice.actions;

export default appSlice.reducer;

