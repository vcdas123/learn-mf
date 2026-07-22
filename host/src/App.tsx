import React, { Suspense, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

import { getTheme } from "./theme";
import { Navigation } from "./components/Navigation";
import { HomePage } from "./components/HomePage";
import { Footer } from "./components/Footer";
import { RemoteErrorBoundary } from "./components/RemoteErrorBoundary";
import { RemoteLoading } from "./components/RemoteLoading";
import NotificationSystem from "./components/NotificationSystem";
import { remoteRoutes, remoteComponentMap } from "./routes/remoteRoutes";
import { setTheme } from "./store/slices/appSlice";
import type { RootState } from "./store";
import "./styles/globals.css";

function App(): React.ReactElement {
  const location = useLocation();
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.app.theme);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme");
    if (!savedTheme) {
      dispatch(setTheme(prefersDarkMode ? "dark" : "light"));
    } else {
      dispatch(setTheme(savedTheme as "light" | "dark"));
    }
  }, [prefersDarkMode, dispatch]);

  const theme = useMemo(() => getTheme(mode), [mode]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
          transition: "background-color 0.3s ease",
        }}
      >
        <Navigation />
        <Box component="main" sx={{ flex: 1 }}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              {remoteRoutes.map(route => {
                const RemoteComponent = remoteComponentMap[route.moduleName];
                if (!RemoteComponent) return null;
                return (
                  <Route
                    key={route.routePath}
                    path={route.routePath}
                    element={
                      <RemoteErrorBoundary moduleName={route.moduleName}>
                        <Suspense
                          fallback={<RemoteLoading moduleName={route.moduleName} />}
                        >
                          <RemoteComponent />
                        </Suspense>
                      </RemoteErrorBoundary>
                    }
                  />
                );
              })}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Box>
        <Footer />
        <NotificationSystem />
      </Box>
    </ThemeProvider>
  );
}

export default App;
