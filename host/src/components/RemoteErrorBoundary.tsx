import React from "react";
import { Container, Typography, Box, Paper, Button } from "@mui/material";
import { motion } from "framer-motion";
import { colors } from "../theme/colors";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface RemoteErrorBoundaryProps {
  children: React.ReactNode;
  moduleName: string;
}

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
        <Container maxWidth="md" sx={{ py: 8, bgcolor: "background.default" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 5,
                borderRadius: "12px",
                border: "1px solid #e6dfd8",
                bgcolor: "background.default",
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: "1.5rem",
                  fontWeight: 500,
                  mb: 2,
                  color: "text.primary",
                }}
              >
                Failed to Load {this.props.moduleName}
              </Typography>
              {isNetworkError && (
                <Typography sx={{ color: "text.secondary", mb: 3, lineHeight: 1.6 }}>
                  The remote server may not be running. Start it with{" "}
                  <Box component="code" sx={{ bgcolor: "rgba(204, 120, 92, 0.08)", px: 1, py: 0.5, borderRadius: "4px", fontFamily: '"JetBrains Mono", monospace', fontSize: "0.875rem" }}>
                    npm run dev
                  </Box>{" "}
                  in the remote's directory.
                </Typography>
              )}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 3,
                  bgcolor: colors.surface.dark,
                  borderRadius: "8px",
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: "0.8125rem",
                  color: colors.onDarkSoft,
                  overflow: "auto",
                }}
              >
                {errorMessage}
              </Paper>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => this.setState({ hasError: false, error: null })}
                  sx={{
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
                >
                  Retry
                </Button>
                <Button
                  variant="text"
                  onClick={() => (window.location.href = "/")}
                  sx={{ color: "primary.main" }}
                >
                  Go Home
                </Button>
              </Box>
            </Paper>
          </motion.div>
        </Container>
      );
    }

    return this.props.children;
  }
}
