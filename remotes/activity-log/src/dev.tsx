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
    primary: {
      main: "#6366f1",
    },
    secondary: {
      main: "#ec4899",
    },
  },
});

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container element not found");
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={standaloneStore}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Box sx={{ p: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              <strong>⚠️ Standalone Development Mode</strong>
              <br />
              Running in standalone mode with mock Redux store. Connect to host for full functionality.
            </Alert>
          </Box>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
