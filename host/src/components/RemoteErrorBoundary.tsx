import React from "react";
import { Container, Alert, Typography, Box, Paper, Button } from "@mui/material";
import { motion } from "framer-motion";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface RemoteErrorBoundaryProps {
  children: React.ReactNode;
  moduleName: string;
}

/**
 * Error Boundary for Remote Module Loading Failures
 * 
 * Catches errors when remote modules fail to load and displays
 * a user-friendly error message with troubleshooting steps.
 */
export class RemoteErrorBoundary extends React.Component<
  RemoteErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: RemoteErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error(`Error loading ${this.props.moduleName}:`, error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || "Unknown error occurred";
      const isNetworkError =
        errorMessage.includes("Loading script failed") ||
        errorMessage.includes("remoteEntry") ||
        errorMessage.includes("net::ERR") ||
        errorMessage.includes("Failed to fetch");

      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert severity="error" sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Failed to Load {this.props.moduleName} Module
              </Typography>
              {isNetworkError ? (
                <>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Unable to connect to the remote module server. Please ensure:
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, mb: 3 }}>
                    <li>The {this.props.moduleName} remote server is running</li>
                    <li>The server is accessible at the configured URL</li>
                    <li>There are no network connectivity issues</li>
                    <li>CORS is properly configured if accessing from a different origin</li>
                  </Box>
                </>
              ) : (
                <Typography variant="body2" sx={{ mb: 3 }}>
                  An error occurred while loading the module:
                </Typography>
              )}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 3,
                  bgcolor: "grey.100",
                  borderRadius: 1,
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                  overflow: "auto",
                }}
              >
                {errorMessage}
              </Paper>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      this.setState({ hasError: false, error: null });
                      window.location.reload();
                    }}
                    sx={{
                      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
                    }}
                  >
                    Retry Loading
                  </Button>
                </motion.div>
                <Button variant="outlined" onClick={() => window.history.back()}>
                  Go Back
                </Button>
                <Button variant="text" onClick={() => (window.location.href = "/")}>
                  Go to Home
                </Button>
              </Box>
            </Alert>
          </motion.div>
        </Container>
      );
    }

    return this.props.children;
  }
}

