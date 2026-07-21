import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Card, CardContent, Skeleton, Button, Chip, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { useVaultStore, fetchMultiplePrices, fetchPrice, PriceResponse } from "../store/useVaultStore";

const METALS = ["XAU", "XAG", "XPT", "XPD", "HG"];
const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "INR", "AUD", "CHF", "CAD", "SGD", "HKD"];

const METAL_NAMES: Record<string, string> = {
  XAU: "Gold",
  XAG: "Silver",
  XPT: "Platinum",
  XPD: "Palladium",
  HG: "Copper",
};

const METAL_COLORS: Record<string, string> = {
  XAU: "#e8a55a",
  XAG: "#a0a0a0",
  XPT: "#d4d4d4",
  XPD: "#8b7355",
  HG: "#b87333",
};

export const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { prices, setPrices, loading, setLoading, error, setError } = useVaultStore();
  const [currency, setCurrency] = useState("USD");
  const [currencyPrices, setCurrencyPrices] = useState<Record<string, PriceResponse>>({});

  useEffect(() => {
    loadPrices();
  }, [currency]);

  const loadPrices = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await fetchMultiplePrices(METALS, currency);
      const priceMap: Record<string, PriceResponse> = {};
      results.forEach((p) => (priceMap[p.symbol] = p));
      setPrices(priceMap);

      // Fetch gold in all currencies for multi-currency grid
      const currResults = await Promise.all(
        CURRENCIES.map(async (c) => {
          try {
            return await fetchPrice("XAU", c);
          } catch {
            return null;
          }
        })
      );
      const currMap: Record<string, PriceResponse> = {};
      currResults.filter(Boolean).forEach((p) => {
        if (p) currMap[p.currency] = p;
      });
      setCurrencyPrices(currMap);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Box>
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
              Vault
            </Typography>
            <Typography sx={{ color: "text.secondary", lineHeight: 1.6 }}>
              Live precious metal prices. Gold, silver, copper, platinum, palladium.
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              component="select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              sx={{
                px: 1.5,
                py: 0.75,
                borderRadius: "6px",
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                color: "text.primary",
                fontSize: "0.8125rem",
                cursor: "pointer",
              }}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Box>
            <Box
              component="button"
              onClick={loadPrices}
              disabled={loading}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 1,
                border: "none",
                background: "none",
                cursor: "pointer",
                borderRadius: "6px",
                color: "primary.main",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <RefreshIcon fontSize="small" />
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1, mb: 5, flexWrap: "wrap" }}>
          <Button component={Link} to="/vault" variant="contained" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>Dashboard</Button>
          <Button component={Link} to="/vault/converter" variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>Converter</Button>
          <Button component={Link} to="/vault/karat" variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>Karat</Button>
          <Button component={Link} to="/vault/history" variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 500 }}>History</Button>
        </Box>

        {error && (
          <Box sx={{ p: 3, bgcolor: "error.light", border: "1px solid", borderColor: "error.main", borderRadius: "8px", mb: 4 }}>
            <Typography sx={{ color: "error.main" }}>{error}</Typography>
          </Box>
        )}

        {/* Metal Cards */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 3, mb: 5 }}>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" height={180} sx={{ borderRadius: "12px" }} />
              ))
            : METALS.map((symbol, index) => {
                const data = prices[symbol];
                return (
                  <motion.div key={symbol} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                    <MetalCard symbol={symbol} data={data} currency={currency} />
                  </motion.div>
                );
              })}
        </Box>

        {/* Multi-Currency Grid for Gold */}
        {prices.XAU && (
          <Box>
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 500, fontSize: "1.25rem", color: "text.primary", mb: 3 }}>
              Gold Prices by Currency
            </Typography>
            <MultiCurrencyGrid currencyPrices={currencyPrices} currentCurrency={currency} />
          </Box>
        )}
      </Container>
    </Box>
  );
};

const MetalCard: React.FC<{ symbol: string; data?: PriceResponse; currency: string }> = ({ symbol, data, currency }) => {
  const color = METAL_COLORS[symbol] || "#888";
  const name = METAL_NAMES[symbol] || symbol;

  return (
    <Card elevation={0} sx={{ borderRadius: "12px", border: "1px solid", borderColor: "divider", bgcolor: "background.paper", height: "100%" }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 500, fontSize: "1.125rem", color: "text.secondary" }}>
            {name} ({symbol})
          </Typography>
          <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: color }} />
        </Box>
        <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 500, fontSize: "2rem", color: "text.primary", mb: 1 }}>
          {data
            ? `${data.currencySymbol}${data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : "—"}
        </Typography>
        {data && (
          <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
            Updated {data.updatedAtReadable}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const MultiCurrencyGrid: React.FC<{ currencyPrices: Record<string, PriceResponse>; currentCurrency: string }> = ({ currencyPrices, currentCurrency }) => {
  const otherCurrencies = CURRENCIES.filter((c) => c !== currentCurrency);

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", lg: "repeat(5, 1fr)" }, gap: 2 }}>
      {otherCurrencies.map((c) => {
        const priceData = currencyPrices[c];
        return (
          <Card key={c} elevation={0} sx={{ borderRadius: "8px", border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mb: 0.5 }}>
                XAU/{c}
              </Typography>
              <Typography sx={{ fontSize: "1rem", fontWeight: 500, color: "text.primary", fontFamily: '"JetBrains Mono", monospace' }}>
                {priceData
                  ? `${priceData.currencySymbol}${priceData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : "—"}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};
