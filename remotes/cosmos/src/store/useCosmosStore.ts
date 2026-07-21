import { create } from "zustand";

export interface ApodData {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl: string;
  media_type: string;
  copyright?: string;
  thumbnail_url?: string;
  service_version: string;
}

interface CosmosState {
  photos: ApodData[];
  selectedDate: string | null;
  loading: boolean;
  error: string | null;
  setPhotos: (photos: ApodData[]) => void;
  addPhotos: (photos: ApodData[]) => void;
  setSelectedDate: (date: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const getEndDate = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
};
const getStartDate = (daysBack: number = 13) => {
  const d = new Date();
  d.setDate(d.getDate() - daysBack);
  return d.toISOString().split("T")[0];
};

export const useCosmosStore = create<CosmosState>((set) => ({
  photos: [],
  selectedDate: null,
  loading: false,
  error: null,
  setPhotos: (photos) => set({ photos }),
  addPhotos: (newPhotos) =>
    set((state) => {
      const existingDates = new Set(state.photos.map((p) => p.date));
      const unique = newPhotos.filter((p) => !existingDates.has(p.date));
      return { photos: [...state.photos, ...unique].sort((a, b) => b.date.localeCompare(a.date)) };
    }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

const API_KEY = process.env.REACT_APP_NASA_API_KEY || "DEMO_KEY";
const BASE_URL = "https://api.nasa.gov";

export async function fetchApodByDate(date: string): Promise<ApodData> {
  const res = await fetch(`${BASE_URL}/planetary/apod?api_key=${API_KEY}&date=${date}`);
  if (!res.ok) throw new Error(`Failed to fetch APOD for ${date}`);
  return res.json();
}

export async function fetchApodRange(start: string, end: string): Promise<ApodData[]> {
  const res = await fetch(`${BASE_URL}/planetary/apod?api_key=${API_KEY}&start_date=${start}&end_date=${end}`);
  if (!res.ok) throw new Error("Failed to fetch APOD range");
  return res.json();
}

export async function fetchInitialPhotos(): Promise<ApodData[]> {
  return fetchApodRange(getStartDate(13), getEndDate());
}
