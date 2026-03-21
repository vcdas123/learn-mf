import { create } from "zustand";

/**
 * Activity Log Module Store (Zustand)
 * 
 * Module-specific state management with localStorage persistence.
 */

export interface ActivityLog {
  id: string;
  title: string;
  status: "active" | "completed" | "draft";
  date: string;
  description?: string;
  entries?: number;
}

interface ActivityState {
  logs: ActivityLog[];
  
  // Actions
  addLog: (log: Omit<ActivityLog, "id">) => void;
  updateLog: (id: string, log: Partial<ActivityLog>) => void;
  removeLog: (id: string) => void;
  getLogById: (id: string) => ActivityLog | undefined;
}

const LOCAL_STORAGE_KEY = "mf-demo-activity-logs";

const initialLogs: ActivityLog[] = [
  { id: "1", title: "Daily Activity Log", date: "2024-01-15", status: "active", description: "Standard daily recording of all system activities and maintenance tasks.", entries: 42 },
  { id: "2", title: "Weekly Summary", date: "2024-01-14", status: "completed", description: "Comprehensive weekly summary of team performance and project milestones.", entries: 128 },
  { id: "3", title: "Monthly Report", date: "2024-01-13", status: "draft", description: "Draft for the upcoming monthly performance review and strategic planning.", entries: 15 },
];

const loadLogs = (): ActivityLog[] => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse logs from localStorage", e);
    }
  }
  return initialLogs;
};

const saveLogs = (logs: ActivityLog[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logs));
};

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export const useActivityStore = create<ActivityState>((set, get) => ({
  logs: loadLogs(),

  addLog: (logData) => {
    const newLogs = [
      {
        ...logData,
        id: generateId(),
        entries: 0,
      },
      ...get().logs,
    ];
    saveLogs(newLogs);
    set({ logs: newLogs });
  },

  updateLog: (id, logData) => {
    const newLogs = get().logs.map((l) =>
      l.id === id ? { ...l, ...logData } : l
    );
    saveLogs(newLogs);
    set({ logs: newLogs });
  },

  removeLog: (id) => {
    const newLogs = get().logs.filter((l) => l.id !== id);
    saveLogs(newLogs);
    set({ logs: newLogs });
  },

  getLogById: (id) => {
    return get().logs.find((l) => l.id === id);
  },
}));
