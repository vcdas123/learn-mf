/**
 * Redux Store Types
 * Export types so remotes can use them with useSelector
 */

export type RootState = {
  app: {
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
  };
};

export type AppDispatch = typeof import("./index").store.dispatch;
