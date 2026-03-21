import { create } from "zustand";

/**
 * Image Analyzer Module Store (Zustand)
 * 
 * Module-specific state management with localStorage persistence.
 */

export interface ImageAnalysis {
  id: string;
  timestamp: string;
  imageName: string;
  result: "success" | "warning" | "error";
  score: number;
  tags: string[];
}

interface ImageState {
  history: ImageAnalysis[];
  
  // Actions
  addAnalysis: (analysis: Omit<ImageAnalysis, "id" | "timestamp">) => void;
  removeAnalysis: (id: string) => void;
  clearHistory: () => void;
}

const LOCAL_STORAGE_KEY = "mf-demo-image-history";

const initialHistory: ImageAnalysis[] = [
  { id: "1", timestamp: "2024-03-20 10:30", imageName: "factory_floor.jpg", result: "success", score: 98.5, tags: ["Industrial", "Safety", "Optimized"] },
  { id: "2", timestamp: "2024-03-19 15:45", imageName: "assembly_line_v2.png", result: "warning", score: 72.1, tags: ["Anomalies Detected", "Maintenance Required"] },
];

const loadHistory = (): ImageAnalysis[] => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse image history from localStorage", e);
    }
  }
  return initialHistory;
};

const saveHistory = (history: ImageAnalysis[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
};

const generateId = () => Date.now().toString();

export const useImageStore = create<ImageState>((set, get) => ({
  history: loadHistory(),

  addAnalysis: (data) => {
    const newHistory = [
      {
        ...data,
        id: generateId(),
        timestamp: new Date().toLocaleString(),
      },
      ...get().history,
    ];
    saveHistory(newHistory);
    set({ history: newHistory });
  },

  removeAnalysis: (id) => {
    const newHistory = get().history.filter((h) => h.id !== id);
    saveHistory(newHistory);
    set({ history: newHistory });
  },

  clearHistory: () => {
    saveHistory([]);
    set({ history: [] });
  },
}));
