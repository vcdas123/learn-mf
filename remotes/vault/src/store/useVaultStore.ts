import { create } from "zustand";

const BASE_URL = "https://api.gold-api.com";

// ---- Types ----

export interface PriceResponse {
  currency: string;
  currencySymbol: string;
  exchangeRate: number;
  name: string;
  price: number;
  symbol: string;
  updatedAt: string;
  updatedAtReadable: string;
}

export interface SymbolInfo {
  name: string;
  symbol: string;
}

export interface OHLCResponse {
  open: number;
  high: number;
  low: number;
  close: number;
  highLowChangePercent: number;
  openCloseChangePercent: number;
  startTimestamp: number;
  endTimestamp: number;
}

export interface HistoryEntry {
  day?: string;
  month?: string;
  week?: string;
  year?: string;
  max_price?: number;
  min_price?: number;
  avg_price?: number;
}

// ---- API Functions (all free, no key, no rate limits) ----

export async function fetchPrice(symbol: string, currency: string = "USD"): Promise<PriceResponse> {
  const res = await fetch(`${BASE_URL}/price/${symbol}/${currency}`);
  if (!res.ok) throw new Error(`Failed to fetch price for ${symbol}`);
  return res.json();
}

export async function fetchMultiplePrices(
  symbols: string[],
  currency: string = "USD"
): Promise<PriceResponse[]> {
  const results = await Promise.all(
    symbols.map((s) => fetchPrice(s, currency))
  );
  return results;
}

export async function fetchSymbols(): Promise<SymbolInfo[]> {
  const res = await fetch(`${BASE_URL}/symbols`);
  if (!res.ok) throw new Error("Failed to fetch symbols");
  return res.json();
}

// ---- Premium endpoints (free tier: 10 req/hr, needs API key) ----

const API_KEY = process.env.REACT_APP_GOLDAPI_KEY || "";

export async function fetchOHLC(
  symbol: string,
  startTimestamp?: number,
  endTimestamp?: number
): Promise<OHLCResponse> {
  const params = new URLSearchParams();
  if (startTimestamp) params.set("startTimestamp", String(startTimestamp));
  if (endTimestamp) params.set("endTimestamp", String(endTimestamp));
  const qs = params.toString() ? `?${params}` : "";
  const res = await fetch(`${BASE_URL}/ohlc/${symbol}${qs}`, {
    headers: { "x-api-key": API_KEY },
  });
  if (!res.ok) throw new Error(`Failed to fetch OHLC for ${symbol}`);
  return res.json();
}

export async function fetchHistory(
  symbol: string,
  startTimestamp: number,
  endTimestamp: number,
  groupBy: string = "day",
  aggregation: string = "max"
): Promise<HistoryEntry[]> {
  const params = new URLSearchParams({
    symbol,
    startTimestamp: String(startTimestamp),
    endTimestamp: String(endTimestamp),
    groupBy,
    aggregation,
  });
  const res = await fetch(`${BASE_URL}/history?${params}`, {
    headers: { "x-api-key": API_KEY },
  });
  if (!res.ok) throw new Error(`Failed to fetch history for ${symbol}`);
  return res.json();
}

// ---- Karat helpers ----

export function calculateKarat(pricePerOz: number, karat: number): number {
  const purity = karat / 24;
  const pricePerGram = pricePerOz / 31.1035;
  return pricePerGram * purity;
}

// ---- Store ----

interface VaultState {
  prices: Record<string, PriceResponse>;
  symbols: SymbolInfo[];
  ohlc: OHLCResponse | null;
  history: HistoryEntry[];
  loading: boolean;
  error: string | null;
  setPrice: (symbol: string, price: PriceResponse) => void;
  setPrices: (prices: Record<string, PriceResponse>) => void;
  setSymbols: (symbols: SymbolInfo[]) => void;
  setOhlc: (ohlc: OHLCResponse) => void;
  setHistory: (history: HistoryEntry[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useVaultStore = create<VaultState>((set) => ({
  prices: {},
  symbols: [],
  ohlc: null,
  history: [],
  loading: false,
  error: null,
  setPrice: (symbol, price) =>
    set((state) => ({ prices: { ...state.prices, [symbol]: price } })),
  setPrices: (prices) => set({ prices }),
  setSymbols: (symbols) => set({ symbols }),
  setOhlc: (ohlc) => set({ ohlc }),
  setHistory: (history) => set({ history }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
