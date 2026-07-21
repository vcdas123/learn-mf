import React, { useState } from "react";
import { Container, Typography, Box, Card, CardContent, Skeleton, Select, MenuItem, Button, TextField, Alert, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useVaultStore, fetchOHLC } from "../store/useVaultStore";

const METALS = [
  { symbol: "XAU", name: "Gold" },
  { symbol: "XAG", name: "Silver" },
  { symbol: "HG", name: "Copper" },
  { symbol: "XPT", name: "Platinum" },
  { symbol: "XPD", name: "Palladium" },
];

declare const process: { env: { REACT_APP_GOLDAPI_KEY?: string } };

export const History: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { ohlc, setOhlc, loading, setLoading, error, setError } = useVaultStore();
  const [symbol, setSymbol] = useState("XAU");
  const [days, setDays] = useState(30);

  const hasApiKey = Boolean(process.env.REACT_APP_GOLDAPI_KEY);

  const loadOHLC = async () => {
    if (!hasApiKey) {
      setError("OHLC endpoint requires a free API key. Sign up at gold-api.com and add REACT_APP_GOLDAPI_KEY to your .env file.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const endTimestamp = Math.floor(Date.now() / 1000);
      const startTimestamp = endTimestamp - days * 86400;
      const data = await fetchOHLC(symbol, startTimestamp, endTimestamp);
      setOhlc(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Box sx={{ mb: 6 }}>
          <Typography
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 500,
              fontSize: { xs: "1.75rem", md: "2.25rem" },
              letterSpacing: "-0.02em",
              color: "text.primary",
              mb: 1,
            }}
          >
            Price History
          </Typography>
          <Typography sx={{ color: "text.secondary", lineHeight: 1.6, mb: 4 }}>
            Open/High/Low/Close data for precious metals. Free tier: 10 requests/hour.
          </Typography>

          {!hasApiKey && (
            <Alert severity="info" sx={{ mb: 3, borderRadius: "8px" }}>
              OHLC data requires a free API key. Sign up at{" "}
              <a href="https://gold-api.com/signup" target="_blank" rel="noopener noreferrer" style={{ color: theme.palette.primary.main }}>
                gold-api.com
              </a>{" "}
              and add <code>REACT_APP_GOLDAPI_KEY=your_key</code> to your .env file.
            </Alert>
          )}

          <Box sx={{ display: "flex", gap: 1, mb: 4, flexWrap: "wrap" }}>
            <Button component={Link} to="/vault" variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>Dashboard</Button>
            <Button component={Link} to="/vault/converter" variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>Converter</Button>
            <Button component={Link} to="/vault/karat" variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>Karat</Button>
            <Button component={Link} to="/vault/history" variant="contained" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>History</Button>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4, flexWrap: "wrap" }}>
            <Select value={symbol} onChange={(e) => setSymbol(e.target.value)} size="small" sx={{ minWidth: 120 }}>
              {METALS.map((m) => (
                <MenuItem key={m.symbol} value={m.symbol}>{m.name} ({m.symbol})</MenuItem>
              ))}
            </Select>
            <Select value={days} onChange={(e) => setDays(Number(e.target.value))} size="small" sx={{ minWidth: 120 }}>
              <MenuItem value={7}>7 days</MenuItem>
              <MenuItem value={30}>30 days</MenuItem>
              <MenuItem value={90}>90 days</MenuItem>
              <MenuItem value={365}>1 year</MenuItem>
            </Select>
            <Button variant="contained" onClick={loadOHLC} disabled={loading} sx={{ textTransform: "none", fontWeight: 500 }}>
              {loading ? "Loading..." : "Load Data"}
            </Button>
          </Box>
        </Box>

        {error && (
          <Box sx={{ p: 3, bgcolor: "error.light", border: "1px solid", borderColor: "error.main", borderRadius: "8px", mb: 4 }}>
            <Typography sx={{ color: "error.main" }}>{error}</Typography>
          </Box>
        )}

        {loading && (
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: "12px" }} />
        )}

        {ohlc && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card elevation={0} sx={{ borderRadius: "12px", border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
              <CardContent sx={{ p: 4 }}>
                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 500, fontSize: "1.25rem", color: "text.primary", mb: 3 }}>
                  {METALS.find((m) => m.symbol === symbol)?.name} ({symbol}) — {days} Day OHLC
                </Typography>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" }, gap: 3, mb: 4 }}>
                  <Box>
                    <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mb: 0.5 }}>Open</Typography>
                    <Typography sx={{ fontSize: "1.25rem", fontWeight: 500, color: "text.primary", fontFamily: '"JetBrains Mono", monospace' }}>
                      ${ohlc.open.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mb: 0.5 }}>High</Typography>
                    <Typography sx={{ fontSize: "1.25rem", fontWeight: 500, color: "success.main", fontFamily: '"JetBrains Mono", monospace' }}>
                      ${ohlc.high.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mb: 0.5 }}>Low</Typography>
                    <Typography sx={{ fontSize: "1.25rem", fontWeight: 500, color: "error.main", fontFamily: '"JetBrains Mono", monospace' }}>
                      ${ohlc.low.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mb: 0.5 }}>Close</Typography>
                    <Typography sx={{ fontSize: "1.25rem", fontWeight: 500, color: "text.primary", fontFamily: '"JetBrains Mono", monospace' }}>
                      ${ohlc.close.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 4 }}>
                  <Box>
                    <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>High/Low Change</Typography>
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, color: ohlc.highLowChangePercent >= 0 ? "success.main" : "error.main" }}>
                      {ohlc.highLowChangePercent >= 0 ? "+" : ""}{ohlc.highLowChangePercent.toFixed(2)}%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>Open/Close Change</Typography>
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, color: ohlc.openCloseChangePercent >= 0 ? "success.main" : "error.main" }}>
                      {ohlc.openCloseChangePercent >= 0 ? "+" : ""}{ohlc.openCloseChangePercent.toFixed(2)}%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>Period</Typography>
                    <Typography sx={{ fontSize: "0.875rem", color: "text.primary" }}>
                      {new Date(ohlc.startTimestamp * 1000).toLocaleDateString()} — {new Date(ohlc.endTimestamp * 1000).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>

                {/* Visual bar */}
                <Box sx={{ mt: 4, p: 2, bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", borderRadius: "8px" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                    <Typography sx={{ fontSize: "0.6875rem", color: "text.secondary", minWidth: 30 }}>Low</Typography>
                    <Box sx={{ flex: 1, height: 8, bgcolor: "divider", borderRadius: 4, position: "relative" }}>
                      <Box
                        sx={{
                          position: "absolute",
                          left: `${((ohlc.open - ohlc.low) / (ohlc.high - ohlc.low)) * 100}%`,
                          width: `${((ohlc.close - ohlc.open) / (ohlc.high - ohlc.low)) * 100}%`,
                          height: "100%",
                          bgcolor: ohlc.close >= ohlc.open ? "success.main" : "error.main",
                          borderRadius: 4,
                          minWidth: 4,
                        }}
                      />
                    </Box>
                    <Typography sx={{ fontSize: "0.6875rem", color: "text.secondary", minWidth: 30 }}>High</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </Container>
    </Box>
  );
};
