import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Provider } from "react-redux";
import { Alert, Box } from "@mui/material";
import App from "./App";
import { standaloneStore } from "./store/standaloneStore";

const theme = createTheme({
  palette: {
    primary: { main: "#cc785c" },
    secondary: { main: "#5db8a6" },
    background: {
      default: "#faf9f5",
      paper: "#efe9de",
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
});

const container = document.getElementById("root");
if (!container) throw new Error("Root container element not found");

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={standaloneStore}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Box sx={{ p: 2 }}>
            <Alert severity="info" sx={{ mb: 2, borderRadius: "8px" }}>
              <strong>Standalone Development Mode</strong> — Running with mock Redux store. Connect to host for full functionality.
            </Alert>
          </Box>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
