import { create } from "zustand";

export interface BookResult {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  edition_count?: number;
  language?: string[];
  subject?: string[];
}

export interface EarthquakeFeature {
  id: string;
  properties: {
    mag: number;
    place: string;
    time: number;
    updated: number;
    status: number;
    tsunami: number;
    felt: number | null;
    significance: number;
  };
  geometry: {
    coordinates: [number, number, number];
  };
}

interface AtlasState {
  books: BookResult[];
  bookSearchQuery: string;
  earthquakes: EarthquakeFeature[];
  loadingBooks: boolean;
  loadingEarthquakes: boolean;
  error: string | null;
  setBooks: (books: BookResult[]) => void;
  setBookSearchQuery: (q: string) => void;
  setEarthquakes: (eq: EarthquakeFeature[]) => void;
  setLoadingBooks: (l: boolean) => void;
  setLoadingEarthquakes: (l: boolean) => void;
  setError: (e: string | null) => void;
}

export const useAtlasStore = create<AtlasState>((set) => ({
  books: [],
  bookSearchQuery: "",
  earthquakes: [],
  loadingBooks: false,
  loadingEarthquakes: false,
  error: null,
  setBooks: (books) => set({ books }),
  setBookSearchQuery: (q) => set({ bookSearchQuery: q }),
  setEarthquakes: (earthquakes) => set({ earthquakes }),
  setLoadingBooks: (loadingBooks) => set({ loadingBooks }),
  setLoadingEarthquakes: (loadingEarthquakes) => set({ loadingEarthquakes }),
  setError: (error) => set({ error }),
}));

export async function searchBooks(query: string, limit: number = 12): Promise<BookResult[]> {
  const res = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}`
  );
  if (!res.ok) throw new Error("Failed to search books");
  const data = await res.json();
  return data.docs || [];
}

export async function fetchRecentEarthquakes(): Promise<EarthquakeFeature[]> {
  const res = await fetch(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
  );
  if (!res.ok) throw new Error("Failed to fetch earthquake data");
  const data = await res.json();
  return (data.features || []).slice(0, 30);
}

export function getBookCoverUrl(coverId: number, size: "S" | "M" | "L" = "M"): string {
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

export function getMagnitudeColor(mag: number): string {
  if (mag >= 5) return "#c64545";
  if (mag >= 3) return "#e8a55a";
  if (mag >= 1) return "#5db872";
  return "#6c6a64";
}

export function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
