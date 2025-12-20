import React, { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store"; // Adjust path to your Redux store

/**
 * ENTERPRISE MICRO-FRONTEND HOST APPLICATION
 *
 * CRITICAL ARCHITECTURE RULES:
 * 1. EXACTLY ONE createRoot() - ONLY in this file
 * 2. EXACTLY ONE BrowserRouter - ONLY in this file
 * 3. Remotes are lazy-loaded React components (NOT mount functions)
 * 4. React context flows naturally through component tree
 * 5. No manual context passing needed
 */

// Lazy load remote applications as React components
// Module Federation exposes them as default exports
const GradeRemote = lazy(() => import("grade/App"));
const DynamicLogSheetRemote = lazy(() => import("dynamiclogsheet/App"));
const AiVisionRemote = lazy(() => import("ai-vision/App"));

// Error boundary for remote loading failures
interface RemoteErrorBoundaryProps {
  children: React.ReactNode;
  moduleName: string;
}

interface RemoteErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RemoteErrorBoundary extends React.Component<
  RemoteErrorBoundaryProps,
  RemoteErrorBoundaryState
> {
  constructor(props: RemoteErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): RemoteErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error(`Error loading ${this.props.moduleName}:`, error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", color: "red" }}>
          <h3>❌ Error Loading {this.props.moduleName}</h3>
          <p>{this.state.error?.message || "Unknown error"}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              marginTop: "10px",
              padding: "8px 16px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading component for lazy-loaded remotes
const RemoteLoading = ({ moduleName }: { moduleName: string }) => (
  <div style={{ padding: "20px", textAlign: "center" }}>
    <div>Loading {moduleName} module...</div>
  </div>
);

/**
 * Main Host Application Component
 *
 * This component:
 * - Wraps everything in BrowserRouter (ONE instance)
 * - Defines top-level routes
 * - Lazy loads remote components
 * - Provides Redux store via Provider
 */
function HostApp(): React.ReactElement {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {/* EXACTLY ONE BrowserRouter - remotes inherit this context */}
        <Routes>
          {/* Host-owned top-level routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Remote module routes - host owns the base path */}
          <Route
            path="/grades/*"
            element={
              <RemoteErrorBoundary moduleName="grade">
                <Suspense fallback={<RemoteLoading moduleName="grade" />}>
                  <GradeRemote />
                </Suspense>
              </RemoteErrorBoundary>
            }
          />

          <Route
            path="/logsheet/*"
            element={
              <RemoteErrorBoundary moduleName="dynamiclogsheet">
                <Suspense
                  fallback={<RemoteLoading moduleName="dynamiclogsheet" />}
                >
                  <DynamicLogSheetRemote />
                </Suspense>
              </RemoteErrorBoundary>
            }
          />

          <Route
            path="/ai-vision/*"
            element={
              <RemoteErrorBoundary moduleName="ai-vision">
                <Suspense fallback={<RemoteLoading moduleName="ai-vision" />}>
                  <AiVisionRemote />
                </Suspense>
              </RemoteErrorBoundary>
            }
          />

          {/* Default route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

// Placeholder components (replace with your actual components)
function LoginPage(): React.ReactElement {
  return <div>Login Page</div>;
}

function DashboardPage(): React.ReactElement {
  return <div>Dashboard</div>;
}

function NotFoundPage(): React.ReactElement {
  return <div>404 - Page Not Found</div>;
}

// EXACTLY ONE createRoot() call - ONLY in host
const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container element not found");
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <HostApp />
  </React.StrictMode>
);
