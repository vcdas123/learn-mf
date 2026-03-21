import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

/**
 * ENTERPRISE MICRO-FRONTEND REMOTE APPLICATION COMPONENT
 *
 * CRITICAL ARCHITECTURE RULES:
 * 1. MUST export a pure React component (default export)
 * 2. MUST NOT call createRoot() or ReactDOM.render()
 * 3. MUST NOT create BrowserRouter or any router provider
 * 4. MUST use <Routes> and <Route> only (inherits router context from host)
 * 5. MUST use relative paths (no leading '/')
 * 6. MUST use React Router hooks (useNavigate, useLocation, useParams)
 * 7. React context (router, Redux) flows naturally from host through ALL components
 * 8. MUST NOT touch DOM or document
 *
 * CONTEXT FLOW CLARIFICATION:
 * React Router context flows through ALL React components, including:
 * - ThemeProvider
 * - InternalStateProvider
 * - Any other React components or Providers
 *
 * Context ONLY breaks at React root boundaries (separate createRoot() calls).
 * Regular React components and Provider components do NOT break context flow.
 */

// Import your route definitions
import { routes, defaultRoute } from "../src/routes";

// Import your providers (theme, internal state, etc.)
import { ThemeProvider } from "./providers/ThemeProvider";
import { InternalStateProvider } from "./providers/InternalStateProvider";

/**
 * Remote Application Component
 *
 * This component:
 * - Is rendered as a child of host's BrowserRouter (via Route element)
 * - Inherits router context automatically (flows through all React components)
 * - Defines nested routes relative to base path
 * - Wraps its own providers (theme, internal state)
 * - Does NOT manage DOM mounting
 * - Does NOT create router context
 * - Is used by BOTH host (production) and dev entry (development)
 *
 * IMPORTANT: React Router context flows through ThemeProvider and
 * InternalStateProvider. Context does NOT break when passing through
 * regular React components or Provider components. Context only breaks
 * at React root boundaries (separate createRoot() calls).
 */
function RemoteApp(): React.ReactElement {
  // ✅ Use React Router hooks - they work because we're inside host's BrowserRouter
  // ✅ Router context flows through ThemeProvider and InternalStateProvider
  // const navigate = useNavigate();
  // const location = useLocation();
  // const params = useParams();

  return (
    <ThemeProvider>
      <InternalStateProvider>
        {/* ✅ Use Routes/Route - inherits router context from host */}
        {/* ✅ Router context flows through ThemeProvider and InternalStateProvider */}
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          ))}
          {/* Fallback for unmatched routes within this remote's scope */}
          <Route path="*" element={<Navigate to={defaultRoute} replace />} />
        </Routes>
      </InternalStateProvider>
    </ThemeProvider>
  );
}

// ✅ Default export - host imports this as a component
export default RemoteApp;

/**
 * Example route definitions (src/routes.tsx):
 *
 * export const routes = [
 *   { path: "/", component: StudentGradesList },        // Matches /grades/
 *   { path: "add", component: StudentGradesCreate },   // Matches /grades/add
 *   { path: ":id", component: StudentGradesDetail },   // Matches /grades/:id
 *   { path: ":id/edit", component: StudentGradesEdit }, // Matches /grades/:id/edit
 * ];
 *
 * export const defaultRoute = "/";
 *
 * IMPORTANT: All paths are RELATIVE (no leading '/')
 */
