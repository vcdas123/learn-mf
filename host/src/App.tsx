import React, { Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";

import { theme } from "./theme";
import { Navigation } from "./components/Navigation";
import { HomePage } from "./components/HomePage";
import { RemoteErrorBoundary } from "./components/RemoteErrorBoundary";
import { RemoteLoading } from "./components/RemoteLoading";
import NotificationSystem from "./components/NotificationSystem";
import { remoteRoutes, remoteComponentMap } from "./routes/remoteRoutes";
import "./styles/globals.css";

/**
 * Main App Component
 *
 * Root component of the host application providing:
 * - Theme provider
 * - Navigation
 * - Route definitions
 * - Error boundaries for remotes
 * - Suspense boundaries for lazy loading
 */
function App(): React.ReactElement {
  const location = useLocation();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Navigation />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            {remoteRoutes.map((route) => {
              const RemoteComponent = remoteComponentMap[route.moduleName];
              if (!RemoteComponent) {
                console.warn(
                  `No remote component found for module: ${route.moduleName}`
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
