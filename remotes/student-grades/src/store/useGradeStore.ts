import { create } from "zustand";

/**
 * Student Grades Module Store (Zustand)
 * 
 * Module-specific state management using Zustand.
 * Redux store from host is also available via Provider for global state.
 */

export interface Grade {
  id: string;
  name: string;
  score: number;
  subject?: string;
  studentName?: string;
  date?: string;
  notes?: string;
}

interface GradeState {
  // State
  grades: Grade[];
  selectedGradeId: string | null;
  searchQuery: string;
  filterBy: "all" | "high" | "medium" | "low";

  // Actions - Grade CRUD
  addGrade: (grade: Omit<Grade, "id">) => void;
  updateGrade: (id: string, grade: Partial<Grade>) => void;
  removeGrade: (id: string) => void;
  getGradeById: (id: string) => Grade | undefined;

  // Actions - Selection & Filters
  setSelectedGradeId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setFilterBy: (filter: "all" | "high" | "medium" | "low") => void;

  // Computed/Selectors
  filteredGrades: () => Grade[];
  averageScore: () => number;
  totalGrades: () => number;
  highGrades: () => Grade[];
  mediumGrades: () => Grade[];
  lowGrades: () => Grade[];
}

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

const LOCAL_STORAGE_KEY = "mf-demo-grades";

const initialGrades: Grade[] = [
  { 
    id: "1", 
    name: "Mathematics Final", 
    score: 95, 
    subject: "Math",
    studentName: "John Doe",
    date: "2024-01-15",
    notes: "Excellent performance"
  },
  { 
    id: "2", 
    name: "Science Project", 
    score: 85, 
    subject: "Science",
    studentName: "Jane Smith",
    date: "2024-01-16",
    notes: "Good work, minor improvements needed"
  },
  { 
    id: "3", 
    name: "History Essay", 
    score: 75, 
    subject: "History",
    studentName: "Bob Johnson",
    date: "2024-01-17",
    notes: "Average performance"
  },
  { 
    id: "4", 
    name: "English Literature", 
    score: 88, 
    subject: "English",
    studentName: "Alice Brown",
    date: "2024-01-18"
  },
  { 
    id: "5", 
    name: "Physics Lab", 
    score: 92, 
    subject: "Physics",
    studentName: "Charlie Wilson",
    date: "2024-01-19",
    notes: "Outstanding lab work"
  },
];

const loadGrades = (): Grade[] => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse grades from localStorage", e);
    }
  }
  return initialGrades;
};

const saveGrades = (grades: Grade[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(grades));
};

export const useGradeStore = create<GradeState>((set, get) => ({
      // Initial state
      grades: loadGrades(),
      selectedGradeId: null,
      searchQuery: "",
      filterBy: "all",

      // Grade CRUD operations
      addGrade: (gradeData) => {
        const newGrades = [
          ...get().grades,
          {
            ...gradeData,
            id: generateId(),
            date: gradeData.date || new Date().toISOString().split("T")[0],
          },
        ];
        saveGrades(newGrades);
        set({ grades: newGrades });
      },

      updateGrade: (id, gradeData) => {
        const newGrades = get().grades.map((g) =>
          g.id === id ? { ...g, ...gradeData } : g
        );
        saveGrades(newGrades);
        set({ grades: newGrades });
      },

      removeGrade: (id) => {
        const newGrades = get().grades.filter((g) => g.id !== id);
        saveGrades(newGrades);
        set((state) => ({
          grades: newGrades,
          selectedGradeId: state.selectedGradeId === id ? null : state.selectedGradeId,
        }));
      },

      getGradeById: (id) => {
        return get().grades.find((g) => g.id === id);
      },

      // Selection & Filters
      setSelectedGradeId: (id) => set({ selectedGradeId: id }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterBy: (filter) => set({ filterBy: filter }),

      // Computed values
      filteredGrades: () => {
        const { grades, searchQuery, filterBy } = get();
        let filtered = grades;

        // Apply search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (g) =>
              g.name.toLowerCase().includes(query) ||
              g.studentName?.toLowerCase().includes(query) ||
              g.subject?.toLowerCase().includes(query) ||
              g.score.toString().includes(query)
          );
        }

        // Apply score filter
        if (filterBy !== "all") {
          filtered = filtered.filter((g) => {
            if (filterBy === "high") return g.score >= 90;
            if (filterBy === "medium") return g.score >= 70 && g.score < 90;
            if (filterBy === "low") return g.score < 70;
            return true;
          });
        }

        return filtered;
      },

      averageScore: () => {
        const grades = get().grades;
        if (grades.length === 0) return 0;
        const sum = grades.reduce((acc, g) => acc + g.score, 0);
        return Math.round((sum / grades.length) * 100) / 100;
      },

      totalGrades: () => get().grades.length,

      highGrades: () => get().grades.filter((g) => g.score >= 90),
      mediumGrades: () => get().grades.filter((g) => g.score >= 70 && g.score < 90),
      lowGrades: () => get().grades.filter((g) => g.score < 70),
    })
);

