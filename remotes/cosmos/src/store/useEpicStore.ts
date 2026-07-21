import { create } from "zustand";

export interface EpicImage {
  identifier: string;
  caption: string;
  date: string;
  image: string;
  version: string;
}

interface EpicState {
  images: EpicImage[];
  collection: "natural" | "enhanced";
  loading: boolean;
  error: string | null;
  setImages: (images: EpicImage[]) => void;
  setCollection: (collection: "natural" | "enhanced") => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useEpicStore = create<EpicState>((set) => ({
  images: [],
  collection: "natural",
  loading: false,
  error: null,
  setImages: (images) => set({ images }),
  setCollection: (collection) => set({ collection }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

const EPIC_BASE = "https://epic.gsfc.nasa.gov";

export async function fetchEpicImages(collection: "natural" | "enhanced" = "natural"): Promise<EpicImage[]> {
  const res = await fetch(`${EPIC_BASE}/api/${collection}`);
  if (!res.ok) throw new Error("Failed to fetch EPIC images");
  return res.json();
}

export function getEpicImageUrl(collection: string, date: string, image: string): string {
  const d = date.split(" ")[0].replace(/-/g, "/");
  return `${EPIC_BASE}/archive/${collection}/${d}/thumbs/${image}.jpg`;
}
