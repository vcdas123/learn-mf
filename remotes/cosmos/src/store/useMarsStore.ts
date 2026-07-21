import { create } from "zustand";

export interface MarsPhoto {
  id: number;
  sol: number;
  camera: {
    id: number;
    name: string;
    full_name: string;
  };
  img_src: string;
  earth_date: string;
  rover: {
    id: number;
    name: string;
    status: string;
  };
}

interface MarsState {
  photos: MarsPhoto[];
  selectedCamera: string;
  loading: boolean;
  error: string | null;
  setPhotos: (photos: MarsPhoto[]) => void;
  setSelectedCamera: (camera: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMarsStore = create<MarsState>((set) => ({
  photos: [],
  selectedCamera: "",
  loading: false,
  error: null,
  setPhotos: (photos) => set({ photos }),
  setSelectedCamera: (camera) => set({ selectedCamera: camera }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

const BASE_URL = "https://rovers.nebulum.one/api/v1";

export const MARS_ROVERS = ["Curiosity", "Perseverance"];

export async function fetchMarsPhotos(
  rover: string = "Curiosity",
  sol?: number,
  earthDate?: string,
  page: number = 1
): Promise<MarsPhoto[]> {
  const params = new URLSearchParams();
  if (sol) params.append("sol", String(sol));
  if (earthDate) params.append("earth_date", earthDate);
  params.append("page", String(page));

  const res = await fetch(`${BASE_URL}/rovers/${rover.toLowerCase()}/photos?${params}`);
  if (!res.ok) throw new Error("Failed to fetch Mars photos");
  const data = await res.json();
  return data.photos || data || [];
}
