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
import { RemoteErrorBoundary } from "./components/RemoteErrorBoundary";
import { RemoteLoading } from "./components/RemoteLoading";
import NotificationSystem from "./components/NotificationSystem";
import { remoteRoutes, remoteComponentMap } from "./routes/remoteRoutes";
import { setTheme } from "./store/slices/appSlice";
import type { RootState } from "./store";
import "./styles/globals.css";

// Architecture Guide Components
const ArchitectureGuide = React.lazy(() => import("./pages/ArchitectureGuide"));
const StateManagementGuide = React.lazy(
  () => import("./pages/StateManagementGuide"),
);
const StylingGuide = React.lazy(() => import("./pages/StylingGuide"));

/**
 * Main App Component
 *
 * Root component of the host application providing:
 * - Theme provider with light/dark support
 * - Navigation
 * - Route definitions
 * - Error boundaries for remotes
 * - Suspense boundaries for lazy loading
 */
function App(): React.ReactElement {
  const location = useLocation();
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.app.theme);

  // System theme preference detection - based on user’s OS-level setting
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  // Sync with system theme on initial load if no preference is saved
  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme");
    if (!savedTheme) {
      dispatch(setTheme(prefersDarkMode ? "dark" : "light"));
    } else {
      dispatch(setTheme(savedTheme as "light" | "dark"));
    }
  }, [prefersDarkMode, dispatch]);

  // Memoize theme object to prevent unnecessary re-renders
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          transition: "background-color 0.3s ease",
        }}
      >
        <Navigation />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />

            {/* Architecture Guide Routes */}
            <Route
              path="/guide/architecture"
              element={
                <Suspense fallback={<RemoteLoading moduleName="Guide" />}>
                  <ArchitectureGuide />
                </Suspense>
              }
            />
            <Route
              path="/guide/state"
              element={
                <Suspense fallback={<RemoteLoading moduleName="Guide" />}>
                  <StateManagementGuide />
                </Suspense>
              }
            />
            <Route
              path="/guide/styling"
              element={
                <Suspense fallback={<RemoteLoading moduleName="Guide" />}>
                  <StylingGuide />
                </Suspense>
              }
            />

            {remoteRoutes.map(route => {
              const RemoteComponent = remoteComponentMap[route.moduleName];
              if (!RemoteComponent) {
                console.warn(
                  `No remote component found for module: ${route.moduleName}`,
                );
                return null;
              }
              return (
                <Route
                  key={route.routePath}
                  path={route.routePath}
                  element={
                    <RemoteErrorBoundary moduleName={route.moduleName}>
                      <Suspense
                        fallback={
                          <RemoteLoading moduleName={route.moduleName} />
                        }
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
        <NotificationSystem />
      </Box>
    </ThemeProvider>
  );
}

export default App;
